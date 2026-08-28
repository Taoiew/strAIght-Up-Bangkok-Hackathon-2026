import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: ReactNode;
};

export default function StatCard({ label, value, change, positive = true, icon }: Props) {
  return (
    <div className="card stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${positive ? "positive" : "negative"}`}>
        {positive ? "↗" : "↘"} {change} <span>vs last month</span>
      </div>
    </div>
  );
}