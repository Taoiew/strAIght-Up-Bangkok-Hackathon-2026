export default function PerformanceChart() {
  return (
    <div className="card performance-card">
      <div className="card-header">
        <div>
          <h2>Portfolio performance</h2>
          <p>Your balance over time</p>
        </div>
        <select defaultValue="30">
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <div className="chart">
        <div className="grid-lines">
          <i /><i /><i /><i /><i />
        </div>
        <svg viewBox="0 0 900 270" preserveAspectRatio="none">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f39abb" stopOpacity=".28" />
              <stop offset="100%" stopColor="#f39abb" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 210 L70 168 L130 190 L205 128 L275 150 L350 116 L420 142 L490 92 L555 114 L625 78 L690 100 L760 54 L825 72 L900 30 L900 270 L0 270Z" fill="url(#area)" />
          <path d="M0 210 L70 168 L130 190 L205 128 L275 150 L350 116 L420 142 L490 92 L555 114 L625 78 L690 100 L760 54 L825 72 L900 30" fill="none" stroke="#f39abb" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <circle cx="760" cy="54" r="6" fill="#f39abb" />
        </svg>
        <div className="tooltip"><small>20 Mar, 12:00 PM</small><b>$155,802.54</b></div>
        <div className="x-axis"><span>1 Mar</span><span>7 Mar</span><span>14 Mar</span><span>20 Mar</span></div>
      </div>
    </div>
  );
}