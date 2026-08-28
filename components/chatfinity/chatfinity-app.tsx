"use client";

import { useEffect, useRef, useState } from "react";
import { ChatWorkspace } from "./chat-workspace";
import { ASSISTANT_REPLY } from "./data";
import { HistorySidebar } from "./history-sidebar";
import { LoginScreen } from "./login-screen";
import { NavigationRail } from "./navigation-rail";
import { SupportModal } from "./support-modal";
import type { ChatMessage, HistoryItem } from "./types";

export function ChatFinityApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLeavingLogin, setIsLeavingLogin] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("New Conversation");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); }, [isDark]);
  useEffect(() => () => { if (replyTimerRef.current) clearTimeout(replyTimerRef.current); }, []);

  function clearReplyTimer() { if (replyTimerRef.current) { clearTimeout(replyTimerRef.current); replyTimerRef.current = null; } }
  function handleLogin() { setIsLeavingLogin(true); window.setTimeout(() => setIsLoggedIn(true), 300); }
  function startNewChat() { clearReplyTimer(); setTitle("New Conversation"); setSelectedHistoryId(null); setMessages([]); setInput(""); }
  function handleLogout() { clearReplyTimer(); setIsLoggedIn(false); setIsLeavingLogin(false); setIsProfileOpen(false); startNewChat(); }

  function sendMessage(text = input) {
    const cleanText = text.trim();
    if (!cleanText) return;
    clearReplyTimer();
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content: cleanText }]);
    setInput("");
    replyTimerRef.current = setTimeout(() => {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: ASSISTANT_REPLY }]);
      replyTimerRef.current = null;
    }, 800);
  }

  function loadHistory(item: HistoryItem) {
    clearReplyTimer();
    setTitle(item.title);
    setSelectedHistoryId(item.id);
    setMessages([{ id: crypto.randomUUID(), role: "user", content: item.prompt }]);
    setInput("");
    replyTimerRef.current = setTimeout(() => {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: ASSISTANT_REPLY }]);
      replyTimerRef.current = null;
    }, 800);
  }

  return (
    <div className="chatfinity-shell h-dvh w-screen overflow-hidden bg-gray-50 text-sm text-gray-800 transition-colors duration-300 dark:bg-chat-surface dark:text-white" onClick={() => isProfileOpen && setIsProfileOpen(false)}>
      {!isLoggedIn ? <LoginScreen isLeaving={isLeavingLogin} onLogin={handleLogin} /> : (
        <div className="flex h-full w-full flex-row opacity-100 transition-opacity duration-500">
          <div className="h-full" onClick={(event) => event.stopPropagation()}><NavigationRail isDark={isDark} isProfileOpen={isProfileOpen} onNewChat={startNewChat} onOpenSupport={() => setIsSupportOpen(true)} onToggleTheme={() => setIsDark((current) => !current)} onToggleProfile={() => setIsProfileOpen((current) => !current)} onLogout={handleLogout} /></div>
          <HistorySidebar isOpen={isSidebarOpen} selectedId={selectedHistoryId} onNewChat={startNewChat} onSelect={loadHistory} />
          <ChatWorkspace title={title} greeting={greeting} isSidebarOpen={isSidebarOpen} messages={messages} input={input} onInputChange={setInput} onSend={() => sendMessage()} onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        </div>
      )}
      {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}
    </div>
  );
}
