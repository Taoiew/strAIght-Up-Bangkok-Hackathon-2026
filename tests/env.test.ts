import { describe, expect, it } from "vitest";
import { getOptionalEnvStatus } from "@/lib/config/env";

describe("environment status", () => {
  it("reports optional configuration without exposing values", () => {
    const status = getOptionalEnvStatus();
    expect(Object.keys(status)).toEqual([
      "databaseConfigured",
      "aiProvider",
      "openaiConfigured",
      "geminiConfigured",
      "externalProcessorConfigured",
      "authConfigured",
    ]);
    expect(typeof status.aiProvider).toBe("string");
    expect([status.databaseConfigured, status.openaiConfigured, status.geminiConfigured, status.externalProcessorConfigured, status.authConfigured].every((value) => typeof value === "boolean")).toBe(true);
  });
});
