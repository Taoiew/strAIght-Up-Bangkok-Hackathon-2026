import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { logger } from "@/lib/logger";

const signupSchema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid email and a password of at least 8 characters." },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name || null,
        passwordHash: await hash(parsed.data.password, 12),
      },
      select: { id: true, email: true, name: true },
    });

    logger.info({ requestId, userId: user.id, event: "auth.signup", status: "completed" });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    logger.error({ requestId, event: "auth.signup", status: "failed", errorType: "DatabaseError", error });
    return NextResponse.json({ error: "Sign up is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
