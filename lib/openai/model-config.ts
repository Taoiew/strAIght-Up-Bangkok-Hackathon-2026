import { getEnv } from "@/lib/config/env";

export function getModelConfig() {
  const env = getEnv();

  return {
    model: env.OPENAI_MODEL,
    temperature: env.OPENAI_TEMPERATURE,
    maxOutputTokens: env.OPENAI_MAX_OUTPUT_TOKENS,
  };
}
