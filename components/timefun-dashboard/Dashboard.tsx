"use client";

import { Bell, Download, Plus, Wallet, TrendingUp, Users, Receipt } from "lucide-react";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import PerformanceChart from "./PerformanceChart";
import Earnings from "./Earnings";
import Activity from "./Activity";
import Creators from "./Creators";
import QuickActions from "./QuickActions";

type DashboardProps = { name: string; email: string; conversationCount: number };

export default function Dashboard({ name, email, conversationCount }: DashboardProps) {
  return (
    <div className="timefun-dashboard app-shell">
      <Sidebar name={name} email={email} />
      <main className="main">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {name}. Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="top-actions">
            <button className="date-button">7 Mar — 20 Mar <span>⌄</span></button>
            <button className="icon-button"><Bell size={17} /></button>
            <button className="outline-button"><Download size={15} /> Export</button>
            <button className="primary-button"><Plus size={16} /> Add funds</button>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard label="Total balance" value="$155,802.54" change="7.8%" icon={<Wallet size={17} />} />
          <StatCard label="Total earnings" value="$34,742.22" change="12.4%" icon={<TrendingUp size={17} />} />
          <StatCard label="AI conversations" value={String(conversationCount)} change="live" icon={<Users size={17} />} />
          <StatCard label="Avg. transaction" value="$128.40" change="2.1%" positive={false} icon={<Receipt size={17} />} />
        </section>

        <section className="main-grid">
          <PerformanceChart />
          <Earnings />
        </section>

        <section className="bottom-grid">
          <Activity />
          <Creators />
          <QuickActions />
        </section>
      </main>
    </div>
  );
}
