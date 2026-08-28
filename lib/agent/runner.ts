import { getEnv } from "@/lib/config/env";
import { loadSystemInstructions } from "@/lib/agent/agent";
import { executeTool } from "@/lib/agent/tool-executor";
import { getTools } from "@/lib/agent/tool-registry";
import type { AgentRunInput, AgentRunResult } from "@/lib/agent/types";
import { OpenAIError } from "@/lib/errors/app-error";
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

export async function runAgent(input: AgentRunInput): Promise<AgentRunResult> {
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
