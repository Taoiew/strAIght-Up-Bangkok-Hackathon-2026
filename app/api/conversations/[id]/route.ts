import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { conversationIdSchema } from "@/lib/agent/schemas";
import { getOwnedConversation } from "@/lib/db/queries";
import { AuthenticationError, toPublicError, ValidationError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logger";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = crypto.randomUUID();

  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { id } = await context.params;
    const parsed = conversationIdSchema.safeParse(id);
    if (!parsed.success) throw new ValidationError("Conversation not found.");

    const conversation = await getOwnedConversation(parsed.data, session.user.id);
    if (!conversation) throw new ValidationError("Conversation not found.");

    return NextResponse.json({ conversation });
  } catch (error) {
    const publicError = toPublicError(error);
    logger.error({ requestId, event: "conversations.get", status: "failed", errorType: publicError.code, error });
    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}
