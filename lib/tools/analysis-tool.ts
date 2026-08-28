import { z } from "zod";
import type { AgentTool } from "@/lib/agent/types";

const calculateSchema = z.object({
  expression: z.string().min(1).max(120),
});

function evaluateBasicExpression(expression: string) {
  if (!/^[\d\s+\-*/().%]+$/.test(expression)) {
    throw new Error("Expression contains unsupported characters.");
  }

  // Controlled calculator for demo arithmetic only.
  const result = Function(`"use strict"; return (${expression});`)() as unknown;
  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("Expression did not produce a finite number.");
  }
  return result;
}

export const calculateTool: AgentTool<typeof calculateSchema> = {
  name: "calculate",
  description: "Evaluate a controlled basic arithmetic expression.",
  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "A basic arithmetic expression using numbers and + - * / % parentheses.",
      },
    },
    required: ["expression"],
    additionalProperties: false,
  },
  schema: calculateSchema,
  async execute(args) {
    const value = evaluateBasicExpression(args.expression);
    return {
      success: true,
      content: `${args.expression} = ${value}`,
      data: { value },
    };
  },
};
