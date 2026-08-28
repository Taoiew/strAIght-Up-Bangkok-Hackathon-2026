import { performance } from "node:perf_hooks";
import { getToolByName } from "@/lib/agent/tool-registry";
import type { ToolContext } from "@/lib/agent/types";
import { ToolExecutionError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger";

export async function executeTool(name: string, args: unknown, context: ToolContext) {
  const started = performance.now();
  const tool = getToolByName(name);

  if (!tool) {
    throw new ToolExecutionError(`Tool "${name}" is not available.`);
  }

  const parsed = tool.schema.safeParse(args);
  if (!parsed.success) {
    throw new ToolExecutionError(`Tool "${name}" received invalid arguments.`);
  }

  try {
    const result = await tool.execute(parsed.data, context);
    const duration = Math.round(performance.now() - started);
    logger.info({
      requestId: context.requestId,
      userId: context.authenticatedUserId,
      conversationId: context.conversationId,
      event: "agent.tool",
      status: result.success ? "completed" : "failed",
      duration,
    });

    return { result, duration };
  } catch (error) {
    const duration = Math.round(performance.now() - started);
    logger.error({
      requestId: context.requestId,
      userId: context.authenticatedUserId,
      conversationId: context.conversationId,
      event: "agent.tool",
      status: "failed",
      duration,
      errorType: "ToolExecutionError",
      error,
    });
    throw error;
  }
}
