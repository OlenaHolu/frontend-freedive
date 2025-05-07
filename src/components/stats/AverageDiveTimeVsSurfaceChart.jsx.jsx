import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
  } from "recharts";
  
  const AverageDiveTimeVsSurfaceChart = ({ data, formatTime, t }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {t("Daily Average Dive Time vs. Surface Time")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis
            tickFormatter={formatTime}
            domain={[0, 'dataMax']}
            label={{ value: t("Minutes"), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={({ label, payload }) => {
              if (!payload || payload.length === 0) return null;
              const surface = payload.find(p => p.dataKey === "avgSurface");
              const dive = payload.find(p => p.dataKey === "avgDive");
              return (
                <div className="bg-white p-3 border rounded shadow text-sm text-gray-800">
                  <div className="font-semibold mb-2">{t("Session Date")}: {label}</div>
                  {surface && (
                    <div style={{ color: "#82ca9d" }}>
                      {t("Avg Surface Time")}: {formatTime(surface.value)}
                    </div>
                  )}
                  {dive && (
                    <div style={{ color: "#8884d8" }}>
                      {t("Avg Dive Time")}: {formatTime(dive.value)}
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="avgDive" name={t("Avg Dive Time")} stroke="#8884d8" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="avgSurface" name={t("Avg Surface Time")} stroke="#82ca9d" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
  
  export default AverageDiveTimeVsSurfaceChart;
  