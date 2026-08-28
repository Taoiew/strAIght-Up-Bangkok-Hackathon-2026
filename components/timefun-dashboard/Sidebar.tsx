"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, BarChart3, ArrowLeftRight, Users, Heart,
  Settings, HelpCircle, Menu, X, Clock3
} from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Workspace", icon: BarChart3, href: "/workspace" },
  { label: "Account", icon: ArrowLeftRight, href: "/account" },
  { label: "Creators", icon: Users, href: "/dashboard#creators" },
  { label: "Watchlist", icon: Heart, href: "/dashboard#watchlist" },
];

export default function Sidebar({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>

        <div className="brand">
          <div className="brand-mark"><Clock3 size={19} strokeWidth={2.5} /></div>
          <span>TIME.FUN</span>
        </div>

        <p className="nav-label">Workspace</p>
        <nav>
          {items.map(({ label, icon: Icon, href }, index) => (
            <Link key={label} href={href} className={`nav-item ${index === 0 ? "active" : ""}`} onClick={() => setOpen(false)}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <p className="nav-label manage">Manage</p>
        <nav>
          <button className="nav-item"><Settings size={17} /><span>Settings</span></button>
          <button className="nav-item"><HelpCircle size={17} /><span>Help Center</span></button>
        </nav>

        <div className="user-card">
          <div className="avatar">K</div>
          <div><b>{name}</b><small>{email}</small></div>
        </div>
      </aside>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
