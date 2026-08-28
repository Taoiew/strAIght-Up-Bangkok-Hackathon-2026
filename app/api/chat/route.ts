import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { chatRequestSchema } from "@/lib/agent/schemas";
import { runAgent } from "@/lib/agent/runner";
import { prisma } from "@/lib/db/client";
import { getOwnedConversation } from "@/lib/db/queries";
import { AuthenticationError, toPublicError, ValidationError } from "@/lib/errors/app-error";
import { getModelConfig } from "@/lib/openai/model-config";
import { logger } from "@/lib/logger";

function streamText(text: string) {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);

  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        await new Promise((resolve) => setTimeout(resolve, 12));
      }
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = performance.now();
  let agentRunId: string | undefined;

  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Send a non-empty message and a valid conversation ID.");

    const conversation = parsed.data.conversationId
      ? await getOwnedConversation(parsed.data.conversationId, session.user.id)
      : await prisma.conversation.create({
          data: {
            userId: session.user.id,
            title: parsed.data.message.slice(0, 60),
          },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        });

    if (!conversation) throw new ValidationError("Conversation not found.");

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: parsed.data.message,
      },
    });

    const agentRun = await prisma.agentRun.create({
      data: {
        conversationId: conversation.id,
        status: "running",
        model: getModelConfig().model,
      },
    });
    agentRunId = agentRun.id;

    const messages = [
      ...conversation.messages.map((message) => ({ role: message.role, content: message.content })),
      { role: "user" as const, content: parsed.data.message },
    ];

    const result = await runAgent({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      conversationId: conversation.id,
      requestId,
      messages,
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: result.content,
      },
    });

    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: { status: "completed", completedAt: new Date() },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    logger.info({
      requestId,
      userId: session.user.id,
      conversationId: conversation.id,
      agentRunId,
      event: "chat.completed",
      status: "completed",
      duration: Math.round(performance.now() - started),
    });

    return new Response(streamText(result.content), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": conversation.id,
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    const publicError = toPublicError(error);

    if (agentRunId) {
      await prisma.agentRun
        .update({
          where: { id: agentRunId },
          data: { status: "failed", completedAt: new Date(), error: publicError.message },
        })
        .catch(() => undefined);
    }

    logger.error({
      requestId,
      agentRunId,
      event: "chat.failed",
      status: "failed",
      duration: Math.round(performance.now() - started),
      errorType: publicError.code,
      error,
    });

    return NextResponse.json({ error: publicError.message, requestId }, { status: publicError.statusCode });
  }
}
