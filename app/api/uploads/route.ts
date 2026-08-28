import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { getOwnedConversation } from "@/lib/db/queries";
import { AuthenticationError, toPublicError, ValidationError } from "@/lib/errors/app-error";
import { processFileWithExternalApi } from "@/lib/files/processor";
import { logger } from "@/lib/logger";

const allowedMimeTypes = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "image/gif"]);
const maxFileSizeBytes = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = performance.now();

  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const formData = await request.formData();
    const file = formData.get("file");
    const conversationIdValue = formData.get("conversationId");

    if (!(file instanceof File)) {
      throw new ValidationError("Please upload a PDF or image file.");
    }

    if (!allowedMimeTypes.has(file.type)) {
      throw new ValidationError("Only PDF and image files are supported.");
    }

    if (file.size > maxFileSizeBytes) {
      throw new ValidationError("Files must be 10 MB or smaller.");
    }

    let conversation =
      typeof conversationIdValue === "string" && conversationIdValue.length > 0
        ? await getOwnedConversation(conversationIdValue, session.user.id)
        : null;

    if (conversationIdValue && !conversation) {
      throw new ValidationError("Conversation not found.");
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: `File: ${file.name}`.slice(0, 80),
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    const processed = await processFileWithExternalApi(file, requestId);

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: `Uploaded file: ${file.name}`,
      },
    });

    const asset = await prisma.uploadedAsset.create({
      data: {
        userId: session.user.id,
        conversationId: conversation.id,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        processor: processed.processor,
        status: "processed",
        extractedText: processed.extractedText,
        processorResponse: processed.rawResponse as Prisma.InputJsonValue,
      },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        processor: true,
        status: true,
        extractedText: true,
        createdAt: true,
        conversationId: true,
      },
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "tool",
        content: `Processed file "${file.name}" with ${processed.processor} processor.\n\n${processed.extractedText}`,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    logger.info({
      requestId,
      userId: session.user.id,
      conversationId: conversation.id,
      event: "file.processed",
      status: "completed",
      duration: Math.round(performance.now() - started),
    });

    return NextResponse.json(
      {
        asset: {
          ...asset,
          createdAt: asset.createdAt.toISOString(),
        },
      },
      {
        status: 201,
        headers: {
          "X-Conversation-Id": conversation.id,
          "X-Request-Id": requestId,
        },
      },
    );
  } catch (error) {
    const publicError = toPublicError(error);
    logger.error({
      requestId,
      event: "file.failed",
      status: "failed",
      duration: Math.round(performance.now() - started),
      errorType: publicError.code,
      error,
    });

    return NextResponse.json({ error: publicError.message, requestId }, { status: publicError.statusCode });
  }
}
