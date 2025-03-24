export default function DiveList({ dives }) {
    if (!dives || dives.length === 0) return <p>No dives logged yet.</p>;
  
    return (
      <ul className="grid gap-4">
        {dives.map((dive, index) => (
          <li key={index} className="bg-white text-black rounded-lg p-4 shadow">
            <p><strong>Start:</strong> {new Date(dive.StartTime).toLocaleString()}</p>
            <p><strong>Depth:</strong> {dive.MaxDepth} m</p>
            <p><strong>Duration:</strong> {dive.Duration} min</p>
            <p><strong>Temps:</strong> {dive.StartTemperature}° ➝ {dive.BottomTemperature}° ➝ {dive.EndTemperature}°</p>
          </li>
        ))}
      </ul>
    );
  }
  