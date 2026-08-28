import { Paperclip, Send, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { PendingFile } from "./types";

type Props = {
  value: string;
  variant: "center" | "bottom";
  pendingFiles: PendingFile[];
  disabled?: boolean;
  isUploading?: boolean;
  onAttach: () => void;
  onRemoveFile: (id: string) => void;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function MessageComposer({ value, variant, pendingFiles, disabled, isUploading, onAttach, onRemoveFile, onChange, onSend }: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); }
  }
  const canSend = Boolean(value.trim()) || pendingFiles.length > 0;
  const pendingFileList = pendingFiles.length > 0 && (
    <div className="mb-2 flex flex-wrap gap-2">
      {pendingFiles.map((item) => (
        <span key={item.id} className="inline-flex max-w-full items-center gap-2 rounded-xl border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-gray-700 dark:text-gray-200">
          <span className="truncate">{item.file.name}</span>
          <button type="button" title="Remove file" onClick={() => onRemoveFile(item.id)} className="rounded-full p-0.5 transition hover:bg-white/60 dark:hover:bg-black/30"><X className="h-3.5 w-3.5" /></button>
        </span>
      ))}
    </div>
  );
  if (variant === "center") return (
    <div className="flex w-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all focus-within:border-brand/50 dark:border-chat-border dark:bg-[#121212] dark:focus-within:border-brand/50">
      {pendingFileList}
      <textarea autoFocus rows={2} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="How can I help you today?" disabled={disabled} className="w-full resize-none bg-transparent p-2 text-lg text-[#100e0e] outline-none placeholder:text-gray-400 disabled:opacity-60 dark:text-white dark:placeholder:text-gray-500" />
      <div className="mt-1 flex items-center justify-between border-t border-gray-100 px-1 pt-2 dark:border-chat-border/50"><button type="button" aria-label="Attach file" onClick={onAttach} disabled={disabled} className="rounded-lg p-2 text-gray-400 transition hover:text-brand disabled:opacity-50"><Paperclip className="h-5 w-5" /></button><button type="button" onClick={onSend} disabled={disabled || !canSend} className="rounded-xl bg-brand px-4 py-2 text-xs font-bold tracking-wide text-white uppercase shadow-sm transition hover:bg-brand-dark disabled:opacity-50">{isUploading ? "Uploading" : "Send"}</button></div>
    </div>
  );
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm transition-all focus-within:border-brand/50 dark:border-chat-border dark:bg-[#121212] dark:focus-within:border-brand/50">
      {pendingFileList}
      <div className="flex items-center">
        <button type="button" aria-label="Attach file" onClick={onAttach} disabled={disabled} className="p-3 text-gray-400 transition hover:text-brand disabled:opacity-50"><Paperclip className="h-5 w-5" /></button>
        <textarea autoFocus rows={1} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="Message ChatFinity..." disabled={disabled} className="max-h-32 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-[#100e0e] outline-none placeholder:text-gray-400 disabled:opacity-60 dark:text-white" />
        <button type="button" aria-label="Send message" onClick={onSend} disabled={disabled || !canSend} className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-dark disabled:opacity-50"><Send className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
