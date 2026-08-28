"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoCredentials = {
  email: "demo@example.com",
  password: "password123",
};

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");

    const submittedEmail = String(formData.get("email") ?? "");
    const submittedPassword = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: submittedEmail, password: submittedPassword, name }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Sign up failed.");
        }
      }

      const result = await signIn("credentials", {
        email: submittedEmail,
        password: submittedPassword,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Email or password is incorrect.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-4">
      {mode === "login" && (
        <div className="rounded-md border border-[var(--line)] bg-[var(--panel-soft)] p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">Demo account</p>
              <p className="text-[var(--muted)]">demo@example.com / password123</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEmail(demoCredentials.email);
                setPassword(demoCredentials.password);
              }}
            >
              Fill demo
            </Button>
          </div>
        </div>
      )}
      {mode === "signup" && (
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input
            className="focus-ring h-11 rounded-md border border-[var(--line)] bg-white px-3"
            name="name"
            autoComplete="name"
          />
        </label>
      )}
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          className="focus-ring h-11 rounded-md border border-[var(--line)] bg-white px-3"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          className="focus-ring h-11 rounded-md border border-[var(--line)] bg-white px-3"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={pending}>
        {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
        {pending ? "Working..." : mode === "login" ? "Login" : "Create account"}
      </Button>
    </form>
  );
}
