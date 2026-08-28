import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Dashboard from "@/components/timefun-dashboard/Dashboard";
import { getUserConversations } from "@/lib/db/queries";
import "./dashboard.css";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const conversations = await getUserConversations(session.user.id);

  return (
    <Dashboard
      conversationCount={conversations.length}
      email={session.user.email ?? ""}
      name={session.user.name || session.user.email || "Creator"}
    />
  );
}
