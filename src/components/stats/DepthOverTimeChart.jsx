import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const DepthOverTimeChart = ({ dives, t }) => {
  const chartData = dives
    .filter((d) => d.StartTime && d.MaxDepth)
    .sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
    .map((dive) => ({
      date: new Date(dive.StartTime), // <- guarda como Date
      depth: Number(dive.MaxDepth),
      time: Number(dive.Duration || 0),
    }))

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {t("Max Depth Over Time")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tickFormatter={(date) =>
              date.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
            }
          />

          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="depth"
            stroke="#007bff"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default DepthOverTimeChart;
