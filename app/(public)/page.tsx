import Link from "next/link";
import { AppNav } from "@/components/layout/app-nav";

export default function LandingPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto grid min-h-[calc(100vh-56px)] max-w-6xl content-center gap-8 px-4 py-12">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[var(--accent)]">AI Hackathon Starter</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">AI Hackathon Starter</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            A flexible AI-powered platform ready to adapt to real-world challenges.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white" href="/signup">
              Get Started
            </Link>
            <Link className="rounded-md border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold" href="/login">
              Login
            </Link>
          </div>
        </section>
        <section className="grid gap-3 md:grid-cols-3">
          {["Authentication", "AI Agent", "Tool Calling"].map((item) => (
            <div key={item} className="rounded-md border border-[var(--line)] bg-white p-4">
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
