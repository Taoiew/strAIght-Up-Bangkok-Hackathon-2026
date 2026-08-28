import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNav } from "@/components/layout/app-nav";
import { WorkspaceClient } from "@/components/chat/workspace-client";
import { getOwnedConversation, getUserConversations } from "@/lib/db/queries";

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const conversations = await getUserConversations(session.user.id);
  const activeConversation = params.conversation
    ? await getOwnedConversation(params.conversation, session.user.id)
    : null;

  return (
    <>
      <AppNav />
      <WorkspaceClient
        initialConversations={conversations.map((conversation) => ({
          id: conversation.id,
          title: conversation.title,
          updatedAt: conversation.updatedAt.toISOString(),
          messages: conversation.messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        }))}
        initialActiveConversationId={activeConversation?.id}
        initialMessages={activeConversation?.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
        }))}
      />
    </>
  );
}
