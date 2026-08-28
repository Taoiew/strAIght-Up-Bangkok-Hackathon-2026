import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { BrandMark } from "@/components/chatfinity/brand-mark";

export default function SignupPage() {
  return (
    <main className="chatfinity-shell flex min-h-dvh w-full items-center justify-center bg-gray-50 p-4 text-gray-800 dark:bg-chat-surface dark:text-white">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-xl dark:border-chat-border dark:bg-chat-panel dark:shadow-2xl dark:shadow-black/50">
        <div className="mb-8 flex items-center justify-center gap-3">
          <BrandMark className="h-10 w-10" />
          <span className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-white">ChatFinity</span>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-xl font-medium text-gray-800 dark:text-white">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start with the generic AI workspace.</p>
        </div>
          <div className="mt-6">
            <Suspense fallback={null}>
              <AuthForm mode="signup" />
            </Suspense>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link className="font-semibold text-brand" href="/login">
              Login
            </Link>
          </p>
      </section>
    </main>
  );
}
