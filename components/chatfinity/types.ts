export type HistoryItem = {
  id: string;
  title: string;
  date: string;
  prompt: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
