import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AppNav } from "@/components/layout/app-nav";

export default function SignupPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto grid min-h-[calc(100vh-56px)] max-w-md content-center px-4 py-12">
        <section className="rounded-md border border-[var(--line)] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Start with the generic AI workspace.</p>
          <div className="mt-6">
            <AuthForm mode="signup" />
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link className="font-semibold text-[var(--accent)]" href="/login">
              Login
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
