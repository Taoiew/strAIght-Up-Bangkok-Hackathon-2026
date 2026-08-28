import { z } from "zod";

export const chatRequestSchema = z.object({
  conversationId: z.string().cuid().optional(),
  message: z.string().trim().min(1).max(8000),
  attachments: z
    .array(
      z.object({
        fileName: z.string().min(1).max(255),
        extractedText: z.string().max(12000).optional().nullable(),
      }),
    )
    .max(5)
    .optional(),
});

export const conversationIdSchema = z.string().cuid();
