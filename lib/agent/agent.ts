import { readFile } from "node:fs/promises";
import path from "node:path";
import { productConfig } from "@/lib/config/product";

async function readPromptFile(name: string) {
  return readFile(path.join(process.cwd(), "prompts", name), "utf8");
}

function applyProductConfig(template: string) {
  return template
    .replaceAll("{{PRODUCT_NAME}}", productConfig.name)
    .replaceAll("{{PRODUCT_DESCRIPTION}}", productConfig.description)
    .replaceAll("{{TARGET_USERS}}", productConfig.targetUsers)
    .replaceAll("{{PROBLEM_STATEMENT}}", productConfig.problemStatement)
    .replaceAll("{{PRIMARY_GOAL}}", productConfig.primaryGoal)
    .replaceAll("{{DOMAIN}}", productConfig.domain)
    .replaceAll("{{EXPECTED_OUTCOME}}", productConfig.expectedOutcome);
}

export async function loadSystemInstructions() {
  const [system, guardrails, output] = await Promise.all([
    readPromptFile("system.md"),
    readPromptFile("guardrails.md"),
    readPromptFile("output.md"),
  ]);

  return [applyProductConfig(system), guardrails, output].join("\n\n");
}
