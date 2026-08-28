import { cn } from "./utils";

export function BrandMark({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("shrink-0 rounded-full bg-gradient-to-tr from-brand-light to-brand shadow-sm", className)} />;
}
