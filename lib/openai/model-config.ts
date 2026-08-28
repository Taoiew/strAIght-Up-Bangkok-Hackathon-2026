import { getEnv } from "@/lib/config/env";

export function getModelConfig() {
  const env = getEnv();

  return {
    provider: env.AI_PROVIDER,
    model: env.OPENAI_MODEL,
    geminiModel: env.GEMINI_MODEL,
    temperature: env.OPENAI_TEMPERATURE,
    maxOutputTokens: env.OPENAI_MAX_OUTPUT_TOKENS,
  };
}
