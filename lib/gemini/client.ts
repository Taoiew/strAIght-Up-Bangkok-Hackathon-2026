import { ConfigurationError } from "@/lib/errors/app-error";

type GeminiPart =
  | { text: string }
  | { functionCall: { name: string; args?: Record<string, unknown> } }
  | { functionResponse: { name: string; response: Record<string, unknown> } };

export type GeminiContent = {
  role?: "user" | "model";
  parts: GeminiPart[];
};

export type GeminiGenerateRequest = {
  model: string;
  systemInstruction: { parts: Array<{ text: string }> };
  contents: GeminiContent[];
  tools?: Array<{
    functionDeclarations: Array<{
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    }>;
  }>;
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
};

export type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
};

export async function generateGeminiContent(request: GeminiGenerateRequest) {
  if (!process.env.GEMINI_API_KEY) {
    throw new ConfigurationError("GEMINI_API_KEY is not configured.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: request.systemInstruction,
      contents: request.contents,
      tools: request.tools,
      generationConfig: request.generationConfig,
    }),
  });

  if (!response.ok) {
    throw new ConfigurationError(`Gemini request failed with status ${response.status}.`);
  }

  return (await response.json()) as GeminiGenerateResponse;
}
