import { z } from "zod";
import type { AgentTool } from "@/lib/agent/types";

const knowledgeSchema = z.object({
  query: z.string().min(1).max(200),
});

const mockKnowledge = [
  {
    title: "Starter scope",
    content: "This application is a generic AI hackathon starter. It should stay domain-neutral until the challenge is known.",
  },
  {
    title: "Adaptation files",
    content: "Hackathon-day changes should primarily happen in product config, prompts, tools, business logic, database extensions, and UI.",
  },
  {
    title: "Security baseline",
    content: "Secrets stay server-side, ownership is enforced by authenticated user ID, and retrieved data is treated as untrusted.",
  },
];

export const searchInternalKnowledgeTool: AgentTool<typeof knowledgeSchema> = {
  name: "search_internal_knowledge",
  description: "Search a small mock internal knowledge dataset. This is a placeholder for future RAG.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query for the internal mock knowledge base.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  schema: knowledgeSchema,
  async execute(args) {
    const terms = args.query.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = mockKnowledge.filter((item) =>
      terms.some((term) => `${item.title} ${item.content}`.toLowerCase().includes(term)),
    );

    return {
      success: true,
      content: matches.length
        ? matches.map((item) => `${item.title}: ${item.content}`).join("\n")
        : "No matching internal knowledge found.",
      data: { matches },
    };
  },
};
