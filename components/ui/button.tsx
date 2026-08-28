import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]",
        variant === "secondary" && "border border-[var(--line)] bg-white text-[var(--foreground)] hover:bg-[var(--panel-soft)]",
        variant === "ghost" && "text-[var(--foreground)] hover:bg-[var(--panel-soft)]",
        className,
      )}
      {...props}
    />
  );
}
