const activities: Array<[string, string, string, string, boolean]> = [
  ["↗", "Received payment from @alex", "Today, 2:42 PM", "+$420.00", true],
  ["◉", "Bought 13 mins of @kawz", "Today, 1:20 PM", "−$234.00", false],
  ["＋", "Deposited funds", "Yesterday, 8:15 PM", "+$1,000.00", true],
  ["↗", "Received payment from @milo", "Yesterday, 4:06 PM", "+$180.00", true],
];

export default function Activity() {
  return (
    <div className="card">
      <div className="card-header"><h2>Recent activity</h2><span className="link">View all →</span></div>
      <div>
        {activities.map(([icon, title, time, amount, positive]) => (
          <div className="activity" key={title}>
            <div className="activity-icon">{icon}</div>
            <div className="activity-main"><b>{title}</b><small>{time}</small></div>
            <strong className={positive ? "positive" : ""}>{amount}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
