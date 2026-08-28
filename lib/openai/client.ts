import OpenAI from "openai";
import { ConfigurationError } from "@/lib/errors/app-error";

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new ConfigurationError("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
