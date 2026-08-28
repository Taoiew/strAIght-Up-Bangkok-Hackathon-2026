import type { FormEvent } from "react";
import { BrandMark } from "./brand-mark";

export function LoginScreen({ isLeaving, onLogin }: { isLeaving: boolean; onLogin: () => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onLogin();
  }

  return (
    <main className={`flex h-full w-full items-center justify-center transition-opacity duration-300 ${isLeaving ? "opacity-0" : "opacity-100"}`}>
      <section className="mx-4 w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 shadow-xl transition-all duration-300 dark:border-chat-border dark:bg-chat-panel dark:shadow-2xl dark:shadow-black/50">
        <div className="mb-8 flex items-center justify-center gap-3">
          <BrandMark className="h-10 w-10" />
          <span className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-white">ChatFinity</span>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-xl font-medium text-gray-800 dark:text-white">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please enter your details to log in.</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
            <input type="email" defaultValue="chisapat@example.com" className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand dark:border-gray-700 dark:bg-[#121212] dark:text-white" />
          </label>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
            <input type="password" defaultValue="password" className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand dark:border-gray-700 dark:bg-[#121212] dark:text-white" />
          </label>
          <button type="submit" className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-medium text-white shadow-md shadow-brand/30 transition hover:bg-brand-dark">Log In</button>
        </form>
      </section>
    </main>
  );
}
