import { describe, expect, it } from "vitest";
import { getOptionalEnvStatus } from "@/lib/config/env";

describe("environment status", () => {
  it("reports optional configuration without exposing values", () => {
    const status = getOptionalEnvStatus();
    expect(Object.keys(status)).toEqual(["databaseConfigured", "openaiConfigured", "authConfigured"]);
    expect(Object.values(status).every((value) => typeof value === "boolean")).toBe(true);
  });
});
