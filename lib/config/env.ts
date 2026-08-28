import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is not configured."),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is not configured."),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is not configured.").optional(),
  OPENAI_MODEL: z.string().default("gpt-5-mini"),
  OPENAI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.2),
  OPENAI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1200),
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
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    authConfigured: Boolean(process.env.AUTH_SECRET),
  };
}
