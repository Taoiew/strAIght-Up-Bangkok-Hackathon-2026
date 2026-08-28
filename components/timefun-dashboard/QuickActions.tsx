import { ArrowUpRight, Plus, Clock3, Send, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function QuickActions() {
  const actions: Array<[LucideIcon, string]> = [
    [Plus, "Add funds"], [Send, "Send money"], [Clock3, "Buy time"], [ArrowUpRight, "Withdraw"]
  ];
  return (
    <div className="card">
      <div className="card-header"><h2>Quick actions</h2></div>
      <div className="quick-grid">
        {actions.map(([Icon, label]) => (
          <button key={label}><Icon size={16} /><b>{label}</b><span>Open →</span></button>
        ))}
      </div>
      <div className="completion">
        <div className="completion-top"><span>Profile completion</span><b>88%</b></div>
        <div className="progress"><i style={{ width: "88%" }} /></div>
        <small><CheckCircle2 size={12} /> Almost there!</small>
      </div>
    </div>
  );
}
