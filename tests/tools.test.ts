import { describe, expect, it } from "vitest";
import { getTools } from "@/lib/agent/tool-registry";
import { calculateTool } from "@/lib/tools/analysis-tool";

describe("tool registry", () => {
  it("registers required starter tools", () => {
    expect(getTools().map((tool) => tool.name)).toEqual([
      "get_current_user",
      "search_internal_knowledge",
      "calculate",
    ]);
  });

  it("validates calculator arguments", async () => {
    const result = await calculateTool.execute({ expression: "23 * 47" }, {
      authenticatedUserId: "user_1",
      conversationId: "conversation_1",
      requestId: "request_1",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ value: 1081 });
  });
});
