import { describe, expect, it } from "vitest";
import { chatRequestSchema } from "@/lib/agent/schemas";

describe("chat input validation", () => {
  it("rejects empty messages", () => {
    expect(chatRequestSchema.safeParse({ message: "" }).success).toBe(false);
  });

  it("accepts a valid new conversation message", () => {
    expect(chatRequestSchema.safeParse({ message: "Explain what an API is." }).success).toBe(true);
  });
});
