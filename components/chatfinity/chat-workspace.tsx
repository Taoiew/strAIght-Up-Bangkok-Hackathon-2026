import { Bolt, PanelLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { BrandMark } from "./brand-mark";
import { MessageComposer } from "./message-composer";
import type { ChatMessage } from "./types";

type Props = { title: string; greeting: string; isSidebarOpen: boolean; messages: ChatMessage[]; input: string; onInputChange: (value: string) => void; onSend: () => void; onToggleSidebar: () => void };

export function ChatWorkspace({ title, greeting, isSidebarOpen, messages, input, onInputChange, onSend, onToggleSidebar }: Props) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  useEffect(() => { if (hasMessages) scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" }); }, [hasMessages, messages]);
  return (
    <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white transition-colors dark:bg-[#1e1e1e]">
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur dark:border-chat-border dark:bg-[#1e1e1e]/95"><div className="flex min-w-0 items-center gap-3"><button type="button" title="Toggle sidebar" onClick={onToggleSidebar} className="-ml-2 rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-brand dark:text-gray-400 dark:hover:bg-chat-panel dark:hover:text-white"><PanelLeft className={`h-[22px] w-[22px] transition-transform ${isSidebarOpen ? "" : "rotate-180"}`} /></button><div className="hidden h-4 w-px bg-gray-200 dark:bg-chat-border sm:block" /><h1 className="truncate text-lg font-semibold text-gray-800 dark:text-white">{title}</h1></div></header>
      <div ref={scrollAreaRef} className="relative flex flex-1 flex-col overflow-y-auto">
        {!hasMessages ? (
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center p-6"><div className="mb-8 flex items-center gap-4"><BrandMark className="h-12 w-12" /><h2 className="text-4xl font-semibold tracking-tight text-gray-800 dark:text-white">{greeting}, Chisapat</h2></div><MessageComposer value={input} variant="center" onChange={onInputChange} onSend={onSend} /></div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-8 pb-8">{messages.map((message) => message.role === "user" ? (
            <div key={message.id} className="chatfinity-fade-in flex w-full max-w-3xl flex-row-reverse gap-4 self-end"><div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 dark:bg-[#333] dark:text-gray-300">C</div><div className="rounded-2xl rounded-tr-sm bg-gray-100 px-5 py-3.5 text-[15px] text-[#100e0e] dark:bg-[#2a2a2a] dark:text-gray-200"><p className="whitespace-pre-wrap">{message.content}</p></div></div>
          ) : (
            <div key={message.id} className="chatfinity-fade-in flex w-full max-w-3xl gap-4"><div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-brand-light to-brand text-white shadow-sm"><Bolt className="h-4 w-4" /></div><div className="px-2 py-1.5 text-[15px] leading-relaxed text-[#100e0e] dark:text-gray-200"><p>{message.content}</p></div></div>
          ))}</div>
        )}
      </div>
      {hasMessages && <div className="relative z-10 mx-auto w-full max-w-4xl shrink-0 bg-gradient-to-t from-white via-white to-transparent px-8 pt-4 pb-8 dark:from-[#1e1e1e] dark:via-[#1e1e1e] dark:to-transparent"><MessageComposer value={input} variant="bottom" onChange={onInputChange} onSend={onSend} /><p className="mt-3 text-center text-[11px] text-gray-400">ChatFinity can make mistakes. Consider verifying important information.</p></div>}
    </section>
  );
}
