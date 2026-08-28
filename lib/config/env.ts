import { z } from "zod";

const optionalString = z.preprocess((value) => (value === "" ? undefined : value), z.string().min(1).optional());
const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.string().url().optional());

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is not configured."),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is not configured."),
  AI_PROVIDER: z.enum(["openai", "gemini"]).default("openai"),
  OPENAI_API_KEY: optionalString,
  OPENAI_MODEL: z.string().default("gpt-5-mini"),
  OPENAI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  OPENAI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1200),
  GEMINI_API_KEY: optionalString,
  GEMINI_MODEL: z.string().default("gemini-3-flash-preview"),
  EXTERNAL_PROCESSOR_API_URL: optionalUrl,
  EXTERNAL_PROCESSOR_API_KEY: optionalString,
  MOCK_FILE_PROCESSING: z.coerce.boolean().default(true),
  MAX_AGENT_STEPS: z.coerce.number().int().positive().default(8),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(" ");
    throw new Error(message);
  }

  return parsed.data;
}

export function getOptionalEnvStatus() {
  return {
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    aiProvider: process.env.AI_PROVIDER ?? "openai",
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    externalProcessorConfigured: Boolean(process.env.EXTERNAL_PROCESSOR_API_URL),
    authConfigured: Boolean(process.env.AUTH_SECRET),
  };
}
