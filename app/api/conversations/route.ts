import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createConversation, getUserConversations } from "@/lib/db/queries";
import { AuthenticationError, toPublicError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger";

export async function GET() {
  const requestId = crypto.randomUUID();

  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const conversations = await getUserConversations(session.user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    const publicError = toPublicError(error);
    logger.error({ requestId, event: "conversations.list", status: "failed", errorType: publicError.code, error });
    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}

export async function POST() {
  const requestId = crypto.randomUUID();

  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const conversation = await createConversation(session.user.id);
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    const publicError = toPublicError(error);
    logger.error({ requestId, event: "conversations.create", status: "failed", errorType: publicError.code, error });
    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}
