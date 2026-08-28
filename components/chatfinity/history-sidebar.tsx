import { Plus, Search } from "lucide-react";
import { CHAT_HISTORY } from "./data";
import type { HistoryItem } from "./types";
import { cn } from "./utils";

type Props = { isOpen: boolean; selectedId: string | null; onNewChat: () => void; onSelect: (item: HistoryItem) => void };

export function HistorySidebar({ isOpen, selectedId, onNewChat, onSelect }: Props) {
  return (
    <aside className={cn("shrink-0 overflow-hidden bg-gray-50/50 transition-all duration-300 ease-in-out dark:bg-[#121212]", isOpen ? "w-72 border-r border-gray-200 dark:border-chat-border" : "w-0 border-r-0")}>
      <div className="flex h-full w-72 flex-col">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-chat-border">
          <label className="relative"><span className="sr-only">Search history</span><input type="search" placeholder="Search history..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm shadow-sm outline-none transition focus:border-brand dark:border-chat-border dark:bg-chat-panel dark:text-white dark:shadow-none" /><Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" /></label>
          <button type="button" onClick={onNewChat} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark"><Plus className="h-4 w-4" /> New Chat</button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="mt-2 mb-2 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Recent</p>
          {CHAT_HISTORY.map((item) => (
            <button key={item.id} type="button" onClick={() => onSelect(item)} className={cn("mb-1 block w-full rounded-xl border border-transparent p-3 text-left transition-colors hover:bg-white dark:hover:bg-chat-panel", selectedId === item.id && "bg-brand/10 dark:bg-[#2a2a2a]")}>
              <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-300">{item.title}</span><span className="mt-1 block text-xs text-gray-500">{item.date}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
