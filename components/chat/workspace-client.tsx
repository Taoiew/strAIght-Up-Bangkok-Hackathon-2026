"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FileUp, MessageSquarePlus, Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  id?: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  messages?: Message[];
};

type PendingFile = {
  id: string;
  file: File;
};

type UploadedAsset = {
  fileName: string;
  processor: string;
  extractedText?: string | null;
  conversationId?: string | null;
};

type WorkspaceClientProps = {
  initialConversations: Conversation[];
  initialActiveConversationId?: string;
  initialMessages?: Message[];
};

function formatStableDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function WorkspaceClient({
  initialConversations,
  initialActiveConversationId = initialConversations[0]?.id ?? "",
  initialMessages = initialConversations[0]?.messages ?? [],
}: WorkspaceClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialActiveConversationId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWorking]);

  async function refreshConversations() {
    const response = await fetch("/api/conversations");
    if (response.ok) {
      const payload = (await response.json()) as { conversations: Conversation[] };
      setConversations(payload.conversations);
    }
  }

  async function openConversation(id: string) {
    setError("");
    const response = await fetch(`/api/conversations/${id}`);
    if (!response.ok) {
      setError("Could not load that conversation.");
      return;
    }

    const payload = (await response.json()) as { conversation: Conversation };
    setActiveConversationId(payload.conversation.id);
    setMessages(payload.conversation.messages ?? []);
  }

  function startNewChat() {
    setActiveConversationId("");
    setMessages([]);
    setInput("");
    setPendingFiles([]);
    setError("");
  }

  function queueFiles(files: FileList | null) {
    if (!files?.length) return;

    const nextFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
    }));

    setPendingFiles((current) => [...current, ...nextFiles].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePendingFile(id: string) {
    setPendingFiles((current) => current.filter((item) => item.id !== id));
  }

  async function processFile(file: File, conversationId: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (conversationId) formData.append("conversationId", conversationId);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as {
      error?: string;
      asset?: UploadedAsset;
    };

    if (!response.ok || !payload.asset) {
      throw new Error(payload.error ?? "File processing failed.");
    }

    return {
      asset: payload.asset,
      conversationId: response.headers.get("X-Conversation-Id") ?? payload.asset.conversationId ?? conversationId,
    };
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    const filesToSend = pendingFiles;
    if ((!text && filesToSend.length === 0) || isWorking || isUploading) return;

    setInput("");
    setPendingFiles([]);
    setError("");
    setIsWorking(true);

    const fileSummary = filesToSend.map((item) => item.file.name).join(", ");
    const visibleUserMessage = [text, fileSummary ? `Files: ${fileSummary}` : ""].filter(Boolean).join("\n");
    setMessages((current) => [...current, { role: "user", content: visibleUserMessage }]);

    try {
      let conversationId = activeConversationId;
      const attachments: UploadedAsset[] = [];

      for (const pending of filesToSend) {
        setIsUploading(true);
        setMessages((current) => [...current, { role: "tool", content: "" }]);

        const processed = await processFile(pending.file, conversationId);
        conversationId = processed.conversationId ?? "";
        if (conversationId) setActiveConversationId(conversationId);
        attachments.push(processed.asset);

        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = {
            role: "tool",
            content: `Processed by ${processed.asset.processor}: ${processed.asset.fileName}\n\n${
              processed.asset.extractedText ?? "No extracted text returned."
            }`,
          };
          return next;
        });
      }

      setIsUploading(false);

      if (!text) {
        await refreshConversations();
        return;
      }

      setMessages((current) => [...current, { role: "assistant", content: "" }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          message: text,
          attachments: attachments.map((asset) => ({
            fileName: asset.fileName,
            extractedText: asset.extractedText,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "The AI service is temporarily unavailable.");
      }

      const chatConversationId = response.headers.get("X-Conversation-Id");
      if (chatConversationId) setActiveConversationId(chatConversationId);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = { role: "assistant", content: assistantText };
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

  return (
    <div className="grid min-h-[calc(100vh-56px)] grid-cols-1 bg-[var(--background)] md:grid-cols-[280px_1fr]">
      <aside className="border-b border-[var(--line)] bg-white p-3 md:border-b-0 md:border-r">
        <Button className="w-full" onClick={startNewChat}>
          <MessageSquarePlus size={16} />
          New Chat
        </Button>
        <div className="mt-4 grid max-h-52 gap-1 overflow-auto md:max-h-[calc(100vh-140px)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => openConversation(conversation.id)}
              className={`focus-ring rounded-md px-3 py-2 text-left text-sm ${
                activeConversationId === conversation.id ? "bg-[var(--panel-soft)]" : "hover:bg-[var(--panel-soft)]"
              }`}
            >
              <span className="block truncate font-medium">{conversation.title}</span>
              <span className="block text-xs text-[var(--muted)]">
                {formatStableDate(conversation.updatedAt)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex min-h-0 flex-col">
        <div className="flex-1 overflow-auto px-4 py-6">
          <div className="mx-auto grid max-w-3xl gap-4">
            {messages.length === 0 && (
              <div className="py-24 text-center">
                <h1 className="text-2xl font-semibold">How can I help you today?</h1>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-md px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--line)] bg-white text-[var(--foreground)]"
                  }`}
                >
                  {message.content || (
                    <span className="inline-flex items-center gap-2 text-[var(--muted)]">
                      <Loader2 size={14} className="animate-spin" />
                      AI is working...
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="border-t border-[var(--line)] bg-white p-3">
          <div className="mx-auto flex max-w-3xl gap-2">
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              multiple
              accept="application/pdf,image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                queueFiles(event.target.files);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={isWorking || isUploading}
              title="Upload PDF or image"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
              Upload
            </Button>
            <textarea
              className="focus-ring min-h-11 flex-1 resize-none rounded-md border border-[var(--line)] px-3 py-2 text-sm"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={1}
              placeholder="Send a message"
              disabled={isWorking || isUploading}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <Button type="submit" disabled={isWorking || isUploading || (!input.trim() && pendingFiles.length === 0)} title="Send">
              {isWorking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Send
            </Button>
          </div>
          {pendingFiles.length > 0 && (
            <div className="mx-auto mt-2 flex max-w-3xl flex-wrap gap-2">
              {pendingFiles.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex max-w-full items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-1 text-sm"
                >
                  <span className="truncate">{item.file.name}</span>
                  <button
                    type="button"
                    className="focus-ring rounded p-1 hover:bg-white"
                    title="Remove file"
                    onClick={() => removePendingFile(item.id)}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {error && <p className="mx-auto mt-2 max-w-3xl text-sm text-red-700">{error}</p>}
        </form>
      </main>
    </div>
  );
}
