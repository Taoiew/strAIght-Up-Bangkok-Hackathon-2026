const creators = [
  ["A", "@alex", "1,248 mins sold", "92%", "$8.4K"],
  ["M", "@milo", "982 mins sold", "74%", "$6.1K"],
  ["S", "@sora", "751 mins sold", "58%", "$4.8K"],
];

export default function Creators() {
  return (
    <div className="card">
      <div className="card-header"><h2>Top creators</h2><span className="period">This week</span></div>
      {creators.map(([letter, name, mins, width, value]) => (
        <div className="creator" key={name}>
          <div className="avatar">{letter}</div>
          <div className="creator-main">
            <b>{name}</b><small>{mins}</small>
            <div className="progress"><i style={{ width }} /></div>
          </div>
          <span className="pill">{value}</span>
        </div>
      ))}
    </div>
  );
}