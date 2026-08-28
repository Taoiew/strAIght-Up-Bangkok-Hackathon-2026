import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export async function AppNav() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          Hackathon Starter
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {session?.user ? (
            <>
              <Link className="rounded-md px-3 py-2 hover:bg-[var(--panel-soft)]" href="/dashboard">
                Dashboard
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-[var(--panel-soft)]" href="/workspace">
                Workspace
              </Link>
              <Link className="rounded-md px-3 py-2 hover:bg-[var(--panel-soft)]" href="/account">
                Account
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="rounded-md px-3 py-2 hover:bg-[var(--panel-soft)]" href="/login">
                Login
              </Link>
              <Link className="rounded-md bg-[var(--accent)] px-3 py-2 text-white" href="/signup">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
