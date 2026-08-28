import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNav } from "@/components/layout/app-nav";
import { getOptionalEnvStatus } from "@/lib/config/env";
import { getUserConversations } from "@/lib/db/queries";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [conversations, envStatus] = await Promise.all([
    getUserConversations(session.user.id),
    Promise.resolve(getOptionalEnvStatus()),
  ]);

  return (
    <>
      <AppNav />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Welcome, {session.user.name || session.user.email}</h1>
            <p className="mt-1 text-[var(--muted)]">Your generic AI workspace is ready to adapt.</p>
          </div>
          <Link className="rounded-md bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white" href="/workspace">
            New workspace
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-[var(--line)] bg-white p-4">
            <p className="text-sm text-[var(--muted)]">Conversations</p>
            <p className="mt-2 text-3xl font-semibold">{conversations.length}</p>
          </div>
          <div className="rounded-md border border-[var(--line)] bg-white p-4">
            <p className="text-sm text-[var(--muted)]">Database</p>
            <p className="mt-2 font-semibold">{envStatus.databaseConfigured ? "Configured" : "Missing"}</p>
          </div>
          <div className="rounded-md border border-[var(--line)] bg-white p-4">
            <p className="text-sm text-[var(--muted)]">OpenAI</p>
            <p className="mt-2 font-semibold">{envStatus.openaiConfigured ? "Configured" : "Missing"}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Recent conversations</h2>
          <div className="grid gap-2">
            {conversations.length === 0 ? (
              <div className="rounded-md border border-[var(--line)] bg-white p-4 text-sm text-[var(--muted)]">
                No conversations yet.
              </div>
            ) : (
              conversations.slice(0, 6).map((conversation) => (
                <Link
                  key={conversation.id}
                  className="rounded-md border border-[var(--line)] bg-white p-4 hover:bg-[var(--panel-soft)]"
                  href={`/workspace?conversation=${conversation.id}`}
                >
                  <span className="font-medium">{conversation.title}</span>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
