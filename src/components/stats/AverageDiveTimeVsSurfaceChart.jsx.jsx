import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { formatTime, formatMinutesOnly } from "../../utils/time";
import CorrelationNote from "./CorrelationNote";
import YearSelector from "./YearSelector";

const AverageDiveTimeVsSurfaceChart = ({ dives, t }) => {

  const groupedByDate = {};
  dives.forEach(d => {
    const date = new Date(d.StartTime).toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(d);
  });

  const avgSessionData = Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, entries]) => {
      const avgSurface = Math.min((entries.reduce((sum, d) => sum + (d.SurfaceTime || 0), 0) / entries.length), 300); // clamp to 5 min
      const avgDive = entries.reduce((sum, d) => sum + (d.Duration || 0), 0) / entries.length;
      return {
        date: date,
        fullDate: new Date(date),
        avgSurface,
        avgDive
      };

    });

  const years = [...new Set(avgSessionData.map(d => new Date(d.date).getFullYear()))].sort();
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const filteredData = avgSessionData
    .filter(d => new Date(d.date).getFullYear() === selectedYear)
    .sort((a, b) => new Date(a.date) - new Date(b.date));


  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {t("Daily Average Dive Time vs. Surface Time")}
        </h3>
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              });
            }}
          />
          <YAxis
            domain={[0, 300]}
            ticks={[0, 60, 120, 180, 240, 300]}
            tickFormatter={(value) => {
              if (value === 300) return ">5";
              return formatMinutesOnly(value);
            }}
            label={{
              value: t("Minutes"),
              angle: -90,
              position: "insideLeft"
            }}
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

      {filteredData.length > 2 && (
        <CorrelationNote
          data={filteredData}
          xKey="avgSurface"
          yKey="avgDive"
          t={t}
        />
      )}
    </div>
  );
};

export default AverageDiveTimeVsSurfaceChart;
