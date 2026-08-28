import { z } from "zod";
import type { AgentTool } from "@/lib/agent/types";

const getCurrentUserSchema = z.object({});

export const getCurrentUserTool: AgentTool<typeof getCurrentUserSchema> = {
  name: "get_current_user",
  description: "Return safe profile fields for the authenticated user.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  schema: getCurrentUserSchema,
  async execute(_args, context) {
    return {
      success: true,
      content: "Safe authenticated user profile returned.",
      data: {
        id: context.authenticatedUserId,
        email: context.userEmail,
        name: context.userName,
      },
    };
  },
};
