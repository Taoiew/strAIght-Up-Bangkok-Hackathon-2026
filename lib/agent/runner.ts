import { getEnv } from "@/lib/config/env";
import { loadSystemInstructions } from "@/lib/agent/agent";
import { executeTool } from "@/lib/agent/tool-executor";
import { getTools } from "@/lib/agent/tool-registry";
import type { AgentRunInput, AgentRunResult } from "@/lib/agent/types";
import { OpenAIError } from "@/lib/errors/app-error";
import { generateGeminiContent, type GeminiContent, type GeminiGenerateResponse } from "@/lib/gemini";
import { getOpenAIClient } from "@/lib/openai/client";
import { getModelConfig } from "@/lib/openai/model-config";
import { logger } from "@/lib/logger";

type ResponseContent = {
  type: string;
  text?: string;
};

type ResponseOutputItem = {
  type?: string;
  content?: ResponseContent[];
  call_id?: string;
  name?: string;
  arguments?: string;
};

type ResponsesCreateResult = {
  output_text?: string;
  output?: ResponseOutputItem[];
};

type ResponsesClient = {
  responses: {
    create: (body: Record<string, unknown>) => Promise<ResponsesCreateResult>;
  };
};

function toResponseInput(messages: AgentRunInput["messages"]) {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

function extractText(response: ResponsesCreateResult) {
  if (typeof response.output_text === "string" && response.output_text.length > 0) {
    return response.output_text;
  }

  const chunks: string[] = [];
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" || content.type === "text") {
        chunks.push(content.text ?? "");
      }
    }
  }

  return chunks.join("\n").trim();
}

function extractFunctionCalls(response: ResponsesCreateResult) {
  return (response.output ?? []).filter((item) => item.type === "function_call");
}

function toGeminiContents(messages: AgentRunInput["messages"]): GeminiContent[] {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-12)
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
}

function extractGeminiText(response: GeminiGenerateResponse) {
  return (
    response.candidates?.[0]?.content?.parts
      ?.map((part) => ("text" in part ? part.text : ""))
      .join("")
      .trim() ?? ""
  );
}

function extractGeminiFunctionCalls(response: GeminiGenerateResponse) {
  return (
    response.candidates?.[0]?.content?.parts
      ?.filter((part) => "functionCall" in part)
      .map((part) => ("functionCall" in part ? part.functionCall : null))
      .filter((call): call is { name: string; args?: Record<string, unknown> } => Boolean(call?.name)) ?? []
  );
}

function toGeminiSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === "additionalProperties") continue;

    if (key === "type" && typeof value === "string") {
      converted[key] = value.toUpperCase();
      continue;
    }

    if (key === "properties" && value && typeof value === "object" && !Array.isArray(value)) {
      converted[key] = Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([propertyName, propertySchema]) => [
          propertyName,
          propertySchema && typeof propertySchema === "object" && !Array.isArray(propertySchema)
            ? toGeminiSchema(propertySchema as Record<string, unknown>)
            : propertySchema,
        ]),
      );
      continue;
    }

    if (Array.isArray(value)) {
      converted[key] = value.map((item) =>
        item && typeof item === "object" && !Array.isArray(item)
          ? toGeminiSchema(item as Record<string, unknown>)
          : item,
      );
      continue;
    }

    converted[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? toGeminiSchema(value as Record<string, unknown>)
        : value;
  }

  return converted;
}

async function runGeminiAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const env = getEnv();
  const modelConfig = getModelConfig();
  const instructions = await loadSystemInstructions();
  const tools = getTools();
  const toolEvents: AgentRunResult["toolEvents"] = [];

  let contents = toGeminiContents(input.messages);
  let finalText = "";

  for (let step = 1; step <= env.MAX_AGENT_STEPS; step += 1) {
    logger.info({
      requestId: input.requestId,
      userId: input.userId,
      conversationId: input.conversationId,
      event: "agent.gemini_request",
      status: "started",
    });

    const response = await generateGeminiContent({
      model: modelConfig.geminiModel,
      systemInstruction: { parts: [{ text: instructions }] },
      contents,
      tools: [
        {
          functionDeclarations: tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: toGeminiSchema(tool.parameters),
          })),
        },
      ],
      generationConfig: {
        temperature: modelConfig.temperature,
        maxOutputTokens: modelConfig.maxOutputTokens,
      },
    });

    const functionCalls = extractGeminiFunctionCalls(response);
    if (functionCalls.length === 0) {
      finalText = extractGeminiText(response);
      break;
    }

    contents = [
      ...contents,
      {
        role: "model",
        parts: functionCalls.map((call) => ({
          functionCall: { name: call.name, args: call.args ?? {} },
        })),
      },
    ];

    for (const call of functionCalls) {
      const { result, duration } = await executeTool(call.name, call.args ?? {}, {
        authenticatedUserId: input.userId,
        userEmail: input.userEmail,
        userName: input.userName,
        conversationId: input.conversationId,
        requestId: input.requestId,
      });

      toolEvents.push({ name: call.name, success: result.success, duration });
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: call.name,
              response: { result },
            },
          },
        ],
      });
    }
  }

  if (!finalText) {
    logger.warn({
      requestId: input.requestId,
      userId: input.userId,
      conversationId: input.conversationId,
      event: "agent.max_steps",
      status: "max_steps_reached",
    });
    throw new OpenAIError("The agent reached its step limit before completing the task.");
  }

  return { content: finalText, toolEvents };
}

async function runOpenAIAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const env = getEnv();
  const openai = getOpenAIClient() as unknown as ResponsesClient;
  const modelConfig = getModelConfig();
  const instructions = await loadSystemInstructions();
  const tools = getTools();
  const toolEvents: AgentRunResult["toolEvents"] = [];

  let responseInput: Array<Record<string, unknown>> = toResponseInput(input.messages);
  let finalText = "";

  for (let step = 1; step <= env.MAX_AGENT_STEPS; step += 1) {
    logger.info({
      requestId: input.requestId,
      userId: input.userId,
      conversationId: input.conversationId,
      event: "agent.model_request",
      status: "started",
    });

    const response = await openai.responses.create({
      model: modelConfig.model,
      instructions,
      input: responseInput,
      tools: tools.map((tool) => ({
        type: "function",
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        strict: true,
      })),
      max_output_tokens: modelConfig.maxOutputTokens,
      temperature: modelConfig.temperature,
    });

    const functionCalls = extractFunctionCalls(response);
    if (functionCalls.length === 0) {
      finalText = extractText(response);
      break;
    }

    responseInput = [
      ...responseInput,
      ...functionCalls.map((call) => ({
        type: "function_call",
        call_id: call.call_id,
        name: call.name,
        arguments: call.arguments,
      })),
    ];

    for (const call of functionCalls) {
      const args = call.arguments ? JSON.parse(call.arguments) : {};
      if (!call.name || !call.call_id) {
        throw new OpenAIError("The AI service returned an invalid tool call.");
      }

      const { result, duration } = await executeTool(call.name, args, {
        authenticatedUserId: input.userId,
        userEmail: input.userEmail,
        userName: input.userName,
        conversationId: input.conversationId,
        requestId: input.requestId,
      });

      toolEvents.push({ name: call.name, success: result.success, duration });
      responseInput.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      });
    }
  }

  if (!finalText) {
    logger.warn({
      requestId: input.requestId,
      userId: input.userId,
      conversationId: input.conversationId,
      event: "agent.max_steps",
      status: "max_steps_reached",
    });
    throw new OpenAIError("The agent reached its step limit before completing the task.");
  }

  return { content: finalText, toolEvents };
}

export async function runAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const provider = getEnv().AI_PROVIDER;

  if (provider === "gemini") {
    return runGeminiAgent(input);
  }

  return runOpenAIAgent(input);
}
