import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
  } from "recharts";
  
  const DepthOverTimeChart = ({ data, t }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {t("Max Depth Over Time")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="depth"
            stroke="#007bff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
  
  export default DepthOverTimeChart;
  