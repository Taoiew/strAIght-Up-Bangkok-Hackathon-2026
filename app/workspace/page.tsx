import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ChatFinityApp } from "@/components/chatfinity/chatfinity-app";
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
    <ChatFinityApp
      authenticated
      userName={session.user.name || session.user.email || "there"}
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
  );
}
