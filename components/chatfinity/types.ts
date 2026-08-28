export type HistoryItem = {
  id: string;
  title: string;
  date: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "tool" | "system";
  content: string;
};

export type PendingFile = {
  id: string;
  file: File;
};

export type UploadedAsset = {
  fileName: string;
  processor: string;
  extractedText?: string | null;
  conversationId?: string | null;
};
