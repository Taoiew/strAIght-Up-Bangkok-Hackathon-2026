import { NextResponse } from "next/server";
import { getOptionalEnvStatus } from "@/lib/config/env";
import { prisma } from "@/lib/db/client";

export async function GET() {
  const envStatus = getOptionalEnvStatus();
  let database = false;

  if (envStatus.databaseConfigured) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = true;
    } catch {
      database = false;
    }
  }

  return NextResponse.json({
    status: "ok",
    services: {
      app: true,
      database,
      openaiConfigured: envStatus.openaiConfigured,
      authConfigured: envStatus.authConfigured,
    },
  });
}
