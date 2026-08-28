import { Bolt, LifeBuoy, LogOut, Moon, Settings, Sun, Tag } from "lucide-react";
import { BrandMark } from "./brand-mark";

type Props = {
  isDark: boolean;
  isProfileOpen: boolean;
  onNewChat: () => void;
  onOpenSupport: () => void;
  onToggleTheme: () => void;
  onToggleProfile: () => void;
  onLogout: () => void;
  userName: string;
};

const navItems = [
  { label: "Feat", title: "Features", icon: Bolt },
  { label: "Price", title: "Pricing", icon: Tag },
];

export function NavigationRail({ isDark, isProfileOpen, onNewChat, onOpenSupport, onToggleTheme, onToggleProfile, onLogout, userName }: Props) {
  const initial = userName.charAt(0).toUpperCase() || "U";

  return (
    <nav className="z-50 flex h-full w-16 shrink-0 flex-col items-center justify-between border-r border-gray-200 bg-white py-6 transition-colors dark:border-chat-border dark:bg-chat-base md:w-20">
      <div className="flex w-full flex-col items-center gap-8">
        <button type="button" title="Home" onClick={onNewChat}><BrandMark className="h-10 w-10 transition-transform hover:scale-105" /></button>
        <div className="flex w-full flex-col gap-4 px-2">
          {navItems.map(({ label, title, icon: Icon }) => (
            <button key={title} type="button" title={title} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-brand dark:text-gray-400 dark:hover:bg-chat-panel dark:hover:text-white">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="hidden text-[10px] font-medium md:block">{label}</span>
            </button>
          ))}
          <button type="button" title="Support" onClick={onOpenSupport} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-brand dark:text-gray-400 dark:hover:bg-chat-panel dark:hover:text-white">
            <LifeBuoy className="h-5 w-5" strokeWidth={1.5} /><span className="hidden text-[10px] font-medium md:block">Support</span>
          </button>
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-4">
        <button type="button" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} onClick={onToggleTheme} className="rounded-full p-3 text-gray-500 transition-all hover:bg-gray-100 hover:text-brand dark:text-gray-400 dark:hover:bg-chat-panel dark:hover:text-white">
          {isDark ? <Sun className="h-5 w-5" strokeWidth={1.5} /> : <Moon className="h-5 w-5" strokeWidth={1.5} />}
        </button>
        <button type="button" aria-label="Open profile menu" aria-expanded={isProfileOpen} onClick={onToggleProfile} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-sm ring-brand-light transition hover:ring-2">{initial}</button>
        {isProfileOpen && (
          <div className="absolute bottom-0 left-16 z-[60] flex w-48 flex-col rounded-xl border border-gray-100 bg-white py-2 shadow-xl dark:border-chat-border dark:bg-[#1e1e1e]">
            <div className="mb-2 border-b border-gray-50 px-4 py-2 dark:border-gray-800"><p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{userName}</p><p className="mt-0.5 text-xs font-medium text-green-500">● Logged In</p></div>
            <button type="button" className="flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-brand dark:text-gray-300 dark:hover:bg-[#2a2a2a]"><Settings className="h-4 w-4" /> Settings</button>
            <button type="button" onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"><LogOut className="h-4 w-4" /> Log Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
