import { z } from "zod";

export const chatRequestSchema = z.object({
  conversationId: z.string().cuid().optional(),
  message: z.string().trim().min(1).max(8000),
});

export const conversationIdSchema = z.string().cuid();
