import { Paperclip, Send } from "lucide-react";
import type { KeyboardEvent } from "react";

type Props = { value: string; variant: "center" | "bottom"; onChange: (value: string) => void; onSend: () => void };

export function MessageComposer({ value, variant, onChange, onSend }: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); }
  }
  if (variant === "center") return (
    <div className="flex w-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all focus-within:border-brand/50 dark:border-chat-border dark:bg-[#121212] dark:focus-within:border-brand/50">
      <textarea autoFocus rows={2} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="How can I help you today?" className="w-full resize-none bg-transparent p-2 text-lg text-[#100e0e] outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500" />
      <div className="mt-1 flex items-center justify-between border-t border-gray-100 px-1 pt-2 dark:border-chat-border/50"><button type="button" aria-label="Attach file" className="rounded-lg p-2 text-gray-400 transition hover:text-brand"><Paperclip className="h-5 w-5" /></button><button type="button" onClick={onSend} className="rounded-xl bg-brand px-4 py-2 text-xs font-bold tracking-wide text-white uppercase shadow-sm transition hover:bg-brand-dark">Send</button></div>
    </div>
  );
  return (
    <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm transition-all focus-within:border-brand/50 dark:border-chat-border dark:bg-[#121212] dark:focus-within:border-brand/50">
      <button type="button" aria-label="Attach file" className="p-3 text-gray-400 transition hover:text-brand"><Paperclip className="h-5 w-5" /></button>
      <input autoFocus type="text" value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="Message ChatFinity..." className="min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#100e0e] outline-none placeholder:text-gray-400 dark:text-white" />
      <button type="button" aria-label="Send message" onClick={onSend} className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-dark"><Send className="h-5 w-5" /></button>
    </div>
  );
}
