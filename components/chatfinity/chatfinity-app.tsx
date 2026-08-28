"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { ChatWorkspace } from "./chat-workspace";
import { HistorySidebar } from "./history-sidebar";
import { LoginScreen } from "./login-screen";
import { NavigationRail } from "./navigation-rail";
import { SupportModal } from "./support-modal";
import type { ChatMessage, HistoryItem, PendingFile, UploadedAsset } from "./types";

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  messages?: ChatMessage[];
};

type Props = {
  authenticated?: boolean;
  userName?: string;
  initialConversations?: Conversation[];
  initialActiveConversationId?: string;
  initialMessages?: ChatMessage[];
};

function formatStableDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ChatFinityApp({
  authenticated = false,
  userName = "there",
  initialConversations = [],
  initialActiveConversationId = initialConversations[0]?.id ?? "",
  initialMessages = initialConversations[0]?.messages ?? [],
}: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const [isLeavingLogin, setIsLeavingLogin] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(initialActiveConversationId || null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hour = new Date().getUTCHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const title = conversations.find((conversation) => conversation.id === selectedHistoryId)?.title ?? "New Conversation";
  const history = conversations.map((conversation) => ({
    id: conversation.id,
    title: conversation.title,
    date: formatStableDate(conversation.updatedAt),
  }));

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); }, [isDark]);

  function handleLogin() { setIsLeavingLogin(true); window.setTimeout(() => setIsLoggedIn(true), 300); }
  function startNewChat() { setSelectedHistoryId(null); setMessages([]); setInput(""); setPendingFiles([]); setError(""); }
  function handleLogout() { void signOut({ callbackUrl: "/login" }); }

  async function refreshConversations() {
    const response = await fetch("/api/conversations");
    if (response.ok) {
      const payload = (await response.json()) as { conversations: Conversation[] };
      setConversations(payload.conversations.map((conversation) => ({ ...conversation, messages: conversation.messages ?? [] })));
    }
  }

  async function processFile(file: File, conversationId: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (conversationId) formData.append("conversationId", conversationId);

    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    const payload = (await response.json()) as { error?: string; asset?: UploadedAsset };

    if (!response.ok || !payload.asset) {
      throw new Error(payload.error ?? "File processing failed.");
    }

    return {
      asset: payload.asset,
      conversationId: response.headers.get("X-Conversation-Id") ?? payload.asset.conversationId ?? conversationId,
    };
  }

  function queueFiles(files: FileList | null) {
    if (!files?.length) return;
    setPendingFiles((current) => [
      ...current,
      ...Array.from(files).map((file) => ({ id: `${file.name}-${file.size}-${crypto.randomUUID()}`, file })),
    ].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function sendMessage(text = input) {
    const cleanText = text.trim();
    const filesToSend = pendingFiles;
    if ((!cleanText && filesToSend.length === 0) || isWorking || isUploading) return;

    setInput("");
    setPendingFiles([]);
    setError("");
    setIsWorking(true);

    const fileSummary = filesToSend.map((item) => item.file.name).join(", ");
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: [cleanText, fileSummary ? `Files: ${fileSummary}` : ""].filter(Boolean).join("\n") },
    ]);

    try {
      let conversationId = selectedHistoryId ?? "";
      const attachments: UploadedAsset[] = [];

      for (const pending of filesToSend) {
        setIsUploading(true);
        setMessages((current) => [...current, { id: crypto.randomUUID(), role: "tool", content: "" }]);
        const processed = await processFile(pending.file, conversationId);
        conversationId = processed.conversationId ?? "";
        if (conversationId) setSelectedHistoryId(conversationId);
        attachments.push(processed.asset);
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = {
            id: next[next.length - 1]?.id ?? crypto.randomUUID(),
            role: "tool",
            content: `Processed by ${processed.asset.processor}: ${processed.asset.fileName}\n\n${processed.asset.extractedText ?? "No extracted text returned."}`,
          };
          return next;
        });
      }

      setIsUploading(false);

      if (!cleanText) {
        await refreshConversations();
        return;
      }

      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: "" }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          message: cleanText,
          attachments: attachments.map((asset) => ({ fileName: asset.fileName, extractedText: asset.extractedText })),
        }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "The AI service is temporarily unavailable.");
      }

      const chatConversationId = response.headers.get("X-Conversation-Id");
      if (chatConversationId) setSelectedHistoryId(chatConversationId);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = {
            id: next[next.length - 1]?.id ?? crypto.randomUUID(),
            role: "assistant",
            content: assistantText,
          };
          return next;
        });
      }

      await refreshConversations();
    } catch (caught) {
      setPendingFiles(filesToSend);
      setError(caught instanceof Error ? caught.message : "Message failed.");
    } finally {
      setIsWorking(false);
      setIsUploading(false);
    }
  }

  async function loadHistory(item: HistoryItem) {
    setError("");
    setSelectedHistoryId(item.id);
    setInput("");
    const response = await fetch(`/api/conversations/${item.id}`);
    if (!response.ok) {
      setError("Could not load that conversation.");
      return;
    }
    const payload = (await response.json()) as { conversation: Conversation };
    setMessages(payload.conversation.messages ?? []);
  }

  return (
    <div className="chatfinity-shell h-dvh w-screen overflow-hidden bg-gray-50 text-sm text-gray-800 transition-colors duration-300 dark:bg-chat-surface dark:text-white" onClick={() => isProfileOpen && setIsProfileOpen(false)}>
      {!isLoggedIn ? <LoginScreen isLeaving={isLeavingLogin} onLogin={handleLogin} /> : (
        <div className="flex h-full w-full flex-row opacity-100 transition-opacity duration-500">
          <input ref={fileInputRef} className="hidden" type="file" multiple accept="application/pdf,image/png,image/jpeg,image/webp,image/gif" onChange={(event) => queueFiles(event.target.files)} />
          <div className="h-full" onClick={(event) => event.stopPropagation()}><NavigationRail isDark={isDark} isProfileOpen={isProfileOpen} userName={userName} onNewChat={startNewChat} onOpenSupport={() => setIsSupportOpen(true)} onToggleTheme={() => setIsDark((current) => !current)} onToggleProfile={() => setIsProfileOpen((current) => !current)} onLogout={handleLogout} /></div>
          <HistorySidebar history={history} isOpen={isSidebarOpen} selectedId={selectedHistoryId} onNewChat={startNewChat} onSelect={(item) => void loadHistory(item)} />
          <ChatWorkspace title={title} greeting={greeting} userName={userName} isSidebarOpen={isSidebarOpen} messages={messages} input={input} pendingFiles={pendingFiles} isWorking={isWorking} isUploading={isUploading} error={error} onAttach={() => fileInputRef.current?.click()} onRemoveFile={(id) => setPendingFiles((current) => current.filter((item) => item.id !== id))} onInputChange={setInput} onSend={() => void sendMessage()} onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        </div>
      )}
      {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}
    </div>
  );
}
