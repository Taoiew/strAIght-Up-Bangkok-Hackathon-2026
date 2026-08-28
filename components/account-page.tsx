
"use client";

import {
  Bell,
  Camera,
  ChevronDown,
  CircleDollarSign,
  Compass,
  CreditCard,
  Gift,
  Home,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const nav = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Explore", icon: Compass, href: "/workspace" },
  { label: "Messages", icon: MessageCircle, href: "/workspace", badge: 3 },
  { label: "Portfolio", icon: WalletCards, href: "/dashboard" },
  { label: "Account", icon: UserRound, href: "/account", active: true },
  { label: "Settings", icon: Settings, href: "/account#settings" },
];

const stats = [
  { label: "Total Balance", value: "$155,802.54", delta: "+8.27%" },
  { label: "Total Earnings", value: "$78,600.21", delta: "+12.57%" },
  { label: "Time Sold", value: "72h 45m", delta: "+18.31%" },
  { label: "Followers", value: "9,842", delta: "+6.91%" },
];

const activities = [
  ["Time purchased by @lunarwolf", "2h time slot", "+$3,200.00"],
  ["Payout to bank account", "Chase •••• 4242", "-$4,500.00"],
  ["Time purchased by @pixeldao", "1h time slot", "+$1,800.00"],
  ["Referral bonus from @cryptic", "Invitation reward", "+$250.00"],
  ["Time purchased by @degenape", "3h time slot", "+$4,750.00"],
];

function MiniSparkline() {
  return (
    <svg viewBox="0 0 180 70" className="mt-4 h-14 w-full overflow-visible">
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff67aa" stopOpacity=".45" />
          <stop offset="100%" stopColor="#ff67aa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 56 C20 46, 26 58, 44 40 S74 50, 92 30 S120 44, 142 22 S164 26, 180 18 V70 H0Z" fill="url(#fill)" />
      <path d="M0 56 C20 46, 26 58, 44 40 S74 50, 92 30 S120 44, 142 22 S164 26, 180 18" fill="none" stroke="#ff67aa" strokeWidth="2.2" />
    </svg>
  );
}

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-pink-400" : "bg-zinc-700"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function AccountPage({ name, email }: { name: string; email: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080808] text-zinc-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-[#0b0b0b] p-4 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-3 px-2 text-lg font-black">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-pink-400 text-black">✦</span>
          TIME.FUN
        </div>

        <nav className="mt-7 space-y-2">
          {nav.map(({ label, icon: Icon, href, badge, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-gradient-to-r from-pink-500/25 to-pink-400/60 text-white ring-1 ring-pink-300/15"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span className="flex-1 text-left">{label}</span>
              {badge && <span className="rounded-full bg-pink-400 px-2 py-0.5 text-xs font-bold text-black">{badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-20 left-4 right-4 rounded-2xl border border-pink-300/15 bg-gradient-to-br from-pink-500/20 to-zinc-900 p-4">
          <Gift className="mb-5 text-pink-300" />
          <p className="font-semibold">Unlock Premium</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">Get lower fees, analytics insights, and more.</p>
          <button className="mt-4 w-full rounded-xl bg-pink-400 py-2.5 text-sm font-bold text-black">Upgrade Now</button>
        </div>

        <button
          className="absolute bottom-5 left-8 flex items-center gap-3 text-sm text-zinc-400"
          onClick={() => signOut({ callbackUrl: "/" })}
          type="button"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/10 bg-[#080808]/85 px-4 backdrop-blur-xl md:px-7">
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu />
          </button>
          <h1 className="text-2xl font-semibold">Account</h1>
          <div className="ml-auto hidden w-64 items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-zinc-500 md:flex">
            <Search size={16} />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search TIME.FUN" />
          </div>
          <button className="relative rounded-full border border-white/10 p-2">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pink-400 text-[10px] font-bold text-black">5</span>
          </button>
          <button className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-sm">🧑‍💻</div>
            <span className="hidden text-sm sm:block">{name}</span>
            <ChevronDown size={15} />
          </button>
        </header>

        <div className="space-y-4 p-4 md:p-6">
          <section className="grid gap-4 xl:grid-cols-[2.2fr_repeat(4,1fr)]">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-pink-500/20 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full bg-zinc-300 text-5xl">
                  🧑‍💻
                  <button className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-pink-400 text-black">
                    <Camera size={17} />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold">{name}</h2>
                    <span className="text-pink-400">✿</span>
                  </div>
                  <p className="mt-1 text-zinc-400">@kawz</p>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300">
                    Friends and fans can now buy, trade, and book your time.
                  </p>
                </div>
                <button className="self-start rounded-full bg-pink-400 px-5 py-2 text-sm font-bold text-black">Edit Profile</button>
              </div>
            </div>

            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-[#111] p-4">
                <p className="text-xs text-zinc-500">{s.label}</p>
                <p className="mt-2 text-2xl font-medium">{s.value}</p>
                <p className="mt-2 text-xs text-emerald-400">▲ {s.delta} <span className="text-zinc-600">vs last 7 days</span></p>
                <MiniSparkline />
              </div>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_.9fr]">
            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Earnings Overview</h3>
                  <p className="text-xs text-zinc-500">Total earnings over time</p>
                </div>
                <button className="rounded-lg border border-white/10 px-3 py-2 text-xs">This Month</button>
              </div>
              <div className="mt-6 h-64 rounded-xl bg-gradient-to-b from-pink-400/[.08] to-transparent p-3">
                <svg viewBox="0 0 800 240" className="h-full w-full">
                  {[40, 90, 140, 190].map((y) => <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,.08)" />)}
                  <path d="M0 190 C70 175 80 125 145 145 S240 120 300 145 S370 98 430 130 S500 70 555 92 S625 78 690 95 S745 77 800 85 L800 240 L0 240Z" fill="rgba(255,103,170,.18)" />
                  <path d="M0 190 C70 175 80 125 145 145 S240 120 300 145 S370 98 430 130 S500 70 555 92 S625 78 690 95 S745 77 800 85" fill="none" stroke="#ff67aa" strokeWidth="3" />
                </svg>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Activity</h3>
                <button className="rounded-full border border-white/10 px-3 py-1.5 text-xs">View All</button>
              </div>
              <div className="mt-4 divide-y divide-white/5">
                {activities.map((item, i) => (
                  <div key={item[0]} className="flex items-center gap-3 py-4">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-pink-400/15 text-pink-300">
                      {i === 1 ? <CreditCard size={18} /> : i === 3 ? <Gift size={18} /> : <CircleDollarSign size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{item[0]}</p>
                      <p className="text-xs text-zinc-500">{item[1]}</p>
                    </div>
                    <p className="text-sm">{item[2]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <InfoCard title="Personal Information" icon={<UserRound size={18} />}>
              <Row k="Full Name" v={name} />
              <Row k="Email" v={email} />
              <Row k="Location" v="New York, USA" />
              <Row k="Member Since" v="Mar 12, 2024" />
            </InfoCard>

            <InfoCard title="Connected Accounts" icon={<Mail size={18} />}>
              <Row k="Twitter" v="@kawz ✓" />
              <Row k="Instagram" v="@kawz ✓" />
              <Row k="YouTube" v="Kawz ✓" />
              <Row k="Bank Account" v="•••• 4242 ✓" />
            </InfoCard>

            <InfoCard title="Security" icon={<ShieldCheck size={18} />}>
              <Row k="Password" v="••••••••" />
              <Row k="Two-Factor Auth" v="Enabled ✓" />
              <Row k="Login Alerts" v="Enabled ✓" />
              <Row k="Trusted Devices" v="3 devices" />
            </InfoCard>
          </section>

          <section className="grid gap-3 rounded-2xl border border-white/10 bg-[#111] p-5 md:grid-cols-5">
            <div className="md:col-span-1">
              <h3 className="font-semibold">Notification Preferences</h3>
              <p className="mt-1 text-xs text-zinc-500">Choose what updates you want to receive.</p>
            </div>
            <Preference title="Messages" subtitle="Direct messages" />
            <Preference title="Sales & Purchases" subtitle="Transactions and sales" />
            <Preference title="Earnings Updates" subtitle="Payouts and earnings" />
            <Preference title="Marketing" subtitle="Tips and new features" initial={false} />
          </section>
        </div>
      </section>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-zinc-500">{k}</span>
      <span className="text-right text-zinc-200">{v}</span>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-pink-400">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
      <button className="mt-4 w-full rounded-xl border border-white/10 py-2.5 text-sm text-pink-300 hover:bg-pink-400/5">
        Manage
      </button>
    </div>
  );
}

function Preference({ title, subtitle, initial = true }: { title: string; subtitle: string; initial?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[.02] px-4 py-3">
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
      <Toggle initial={initial} />
    </div>
  );
}
