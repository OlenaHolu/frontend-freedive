import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { formatTime, formatMinutesOnly } from "../../utils/time";
import CorrelationNote from "./CorrelationNote";
import PeriodNavigator from "./PeriodNavigator";

const AverageDiveTimeVsSurfaceChart = ({ dives, t }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (dives.length > 0) {
      const latestDive = dives.reduce((latest, current) => {
        const latestTime = new Date(latest.StartTime).getTime();
        const currentTime = new Date(current.StartTime).getTime();
        return currentTime > latestTime ? current : latest;
      });

      const defaultDate = new Date(latestDive.StartTime);
      setSelectedDate(defaultDate);
    }
  }, [dives]);

  const groupedByDate = {};
  dives.forEach(d => {
    const date = new Date(d.StartTime).toISOString().slice(0, 10); // "YYYY-MM-DD"
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(d);
  });

  const avgSessionData = Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, entries]) => {
      const fullDate = new Date(date);
      const avgSurface = Math.min((entries.reduce((sum, d) => sum + (d.SurfaceTime || 0), 0) / entries.length), 300);
      const avgDive = entries.reduce((sum, d) => sum + (d.Duration || 0), 0) / entries.length;

      return {
        date: fullDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        fullDate,
        year: fullDate.getFullYear(),
        avgSurface,
        avgDive
      };
    });

  const years = [...new Set(avgSessionData.map(d => d.year))].sort();

  const filteredData = avgSessionData
    .filter(d => d.fullDate.getFullYear() === selectedDate.getFullYear())
    .sort((a, b) => a.fullDate - b.fullDate);


  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          {t("stats.avgDiveVsSurfaceTitle")}
        </h3>
        <PeriodNavigator
          range="monthly"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          years={years}
          t={t}
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
          />

          <YAxis
            domain={[0, 300]}
            ticks={[0, 60, 120, 180, 240, 300]}
            tickFormatter={(value) => {
              if (value === 300) return ">5";
              return formatMinutesOnly(value);
            }}
            label={{
              value: t("stats.minutes"),
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
                  <div className="font-semibold mb-2">{t("stats.sessionDate")}: {label}</div>
                  {surface && (
                    <div style={{ color: "#82ca9d" }}>
                      {t("stats.avgSurfaceTime")}: {formatTime(surface.value)}
                    </div>
                  )}
                  {dive && (
                    <div style={{ color: "#8884d8" }}>
                      {t("stats.avgDiveTime")}: {formatTime(dive.value)}
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="avgDive" name={t("stats.avgDiveTime")} stroke="#8884d8" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="avgSurface" name={t("stats.avgSurfaceTime")} stroke="#82ca9d" dot={{ r: 3 }} />
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
