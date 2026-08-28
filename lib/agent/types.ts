import { z } from "zod";

export type ChatRole = "user" | "assistant" | "tool" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ToolContext = {
  authenticatedUserId: string;
  userEmail?: string | null;
  userName?: string | null;
  conversationId: string;
  requestId: string;
};

export type ToolResult = {
  success: boolean;
  content: string;
  data?: unknown;
};

export type AgentTool<TSchema extends z.ZodType = z.ZodType> = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  schema: TSchema;
  execute: (args: z.infer<TSchema>, context: ToolContext) => Promise<ToolResult>;
};

export type AgentRunInput = {
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  conversationId: string;
  requestId: string;
  messages: ChatMessage[];
};

export type AgentRunResult = {
  content: string;
  toolEvents: Array<{
    name: string;
    success: boolean;
    duration: number;
  }>;
};
