import type { AgentTool } from "@/lib/agent/types";
import { calculateTool } from "@/lib/tools/analysis-tool";
import { getCurrentUserTool } from "@/lib/tools/database-tool";
import { searchInternalKnowledgeTool } from "@/lib/tools/knowledge-tool";

export const toolRegistry = [getCurrentUserTool, searchInternalKnowledgeTool, calculateTool] satisfies AgentTool[];

export function getTools() {
  return toolRegistry;
}

export function getToolByName(name: string) {
  return toolRegistry.find((tool) => tool.name === name);
}
