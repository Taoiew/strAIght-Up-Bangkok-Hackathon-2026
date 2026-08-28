import { CircleHelp, MessageSquare, X } from "lucide-react";

export function SupportModal({ onClose }: { onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="support-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()} className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
      <section className="relative w-[450px] rounded-3xl border border-transparent bg-white p-6 shadow-2xl dark:border-chat-border dark:bg-[#1e1e1e]">
        <button type="button" aria-label="Close support center" onClick={onClose} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-200 dark:bg-[#121212] dark:hover:bg-chat-panel"><X className="h-4 w-4" /></button>
        <h2 id="support-title" className="mb-1 text-2xl font-semibold text-[#100e0e] dark:text-white">Support Center</h2><p className="mb-6 text-sm text-gray-500 dark:text-gray-400">How can we help you today?</p>
        <div className="grid grid-cols-2 gap-3">{[{ label: "FAQs", icon: CircleHelp }, { label: "Live Chat", icon: MessageSquare }].map(({ label, icon: Icon }) => <button key={label} type="button" className="group rounded-2xl border border-brand/20 bg-brand/5 p-4 text-left transition hover:bg-brand/10 dark:bg-brand/10 dark:hover:bg-brand/20"><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-brand/20 dark:shadow-none"><Icon className="h-5 w-5 text-brand" /></span><span className="font-medium text-[#100e0e] dark:text-gray-200">{label}</span></button>)}</div>
      </section>
    </div>
  );
}
