export default function Earnings() {
  return (
    <div className="card earnings-card">
      <div className="card-header">
        <div><h2>Earnings breakdown</h2><p>Revenue by source</p></div>
        <span className="period">This month</span>
      </div>
      <div className="earnings-body">
        <div className="donut">
          <div className="donut-center"><small>Total</small><b>$34.7K</b></div>
        </div>
        <div className="legend">
          <div><i className="pink" /><span>Direct message</span><b>$13.9K</b></div>
          <div><i className="purple" /><span>Voice call</span><b>$8.7K</b></div>
          <div><i className="pink" /><span>Group chat</span><b>$7.1K</b></div>
          <div><i className="dark" /><span>Video call</span><b>$5.0K</b></div>
        </div>
      </div>
    </div>
  );
}