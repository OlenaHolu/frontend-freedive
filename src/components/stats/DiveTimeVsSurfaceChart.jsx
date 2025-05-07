import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
  } from "recharts";
  
  const DiveTimeVsSurfaceChart = ({ data, formatTime, formatMinutesOnly, t }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {t("Dive Time vs. Surface Time")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="shortDate" />
          <YAxis
            tickFormatter={formatMinutesOnly}
            label={{ value: t("Minutes"), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={({ label, payload }) => {
              if (!payload || payload.length === 0) return null;
              const dp = payload[0].payload;
              return (
                <div className="bg-white p-2 border rounded shadow text-sm text-gray-800">
                  <div><strong>{dp.fullDate || label}</strong></div>
                  <div>{t("Dive Duration")}: {formatTime(dp.diveSeconds)}</div>
                  <div>{t("Surface Time")}: {formatTime(dp.surfaceSeconds)}</div>
                </div>
              );
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="diveSeconds" name={t("Dive Duration")} stroke="#8884d8" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="surfaceSeconds" name={t("Surface Time")} stroke="#82ca9d" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
  
  export default DiveTimeVsSurfaceChart;
  