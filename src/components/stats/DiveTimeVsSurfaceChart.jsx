import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { formatTime, formatMinutesOnly } from "../../utils/time";
import DateRangeSelector from "./DateRangeSelector";
import PeriodNavigator from "./PeriodNavigator";
import CorrelationNote from "./CorrelationNote";

const DiveTimeVsSurfaceChart = ({ dives, t }) => {
  const [range, setRange] = useState("months"); // "months" | "days" | "years"
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (dives.length > 0) {
      const latestDive = dives.reduce((latest, current) => {
        const latestTime = new Date(latest.StartTime).getTime();
        const currentTime = new Date(current.StartTime).getTime();
        return currentTime > latestTime ? current : latest;
      });

      const latestDate = new Date(latestDive.StartTime);
      const defaultDate =
        range === "months"
          ? new Date(latestDate.getFullYear(), latestDate.getMonth(), 1)
          : range === "years"
            ? new Date(latestDate.getFullYear(), 0, 1)
            : latestDate;

      setSelectedDate(defaultDate);
    }
  }, [dives, range]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

  const filteredData = dives
    .filter(
      (d) =>
        d.SurfaceTime != null && d.Duration != null && d.StartTime != null
    )
    .sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
    .filter((d) => {
      const diveDate = new Date(d.StartTime);
      if (range === "months") {
        return (
          diveDate.getFullYear() === selectedDate.getFullYear() &&
          diveDate.getMonth() === selectedDate.getMonth()
        );
      }
      if (range === "days") {
        return diveDate.toDateString() === selectedDate.toDateString();
      }
      if (range === "years") {
        return diveDate.getFullYear() === selectedDate.getFullYear();
      }
      return true;
    })
    .map((d) => {
      const dateObj = new Date(d.StartTime);
      const originalSurface = d.SurfaceTime;

      let xLabel = "";
      if (range === "months") {
        xLabel = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      } else if (range === "days") {
        xLabel = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
      } else if (range === "years") {
        xLabel = dateObj.toLocaleDateString("en-GB", { month: "short" });
      }

      return {
        xLabel,
        fullDate: dateObj.toLocaleString("en-GB", {
          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        }),
        diveSeconds: d.Duration,
        surfaceSeconds: Math.min(d.SurfaceTime, 300), // clamp to 5 min (for Y axis)
        rawSurface: originalSurface, // store original for tooltip
      };
    });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {t("stats.diveTimeVsSurfaceTitle")}
      </h3>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <DateRangeSelector
          range={range}
          setRange={setRange}
          t={t}
        />
        <PeriodNavigator
          range={range}
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
            dataKey="xLabel"
            angle={-45}
            interval={0} // Show all labels
            tickFormatter={(value, index) => {
              const prev = index > 0 ? filteredData[index - 1].xLabel : null;
              return value === prev ? "" : value;
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
              value: t("stats.minutes"),
              angle: -90,
              position: "insideLeft"
            }}
          />

          <Tooltip
            content={({ label, payload }) => {
              if (!payload || payload.length === 0) return null;
              const dp = payload[0].payload;
              return (
                <div className="bg-white p-2 border rounded shadow text-sm text-gray-800">
                  <div>
                    <strong>{dp.fullDate}</strong>
                  </div>
                  <div>
                    {t("stats.diveDuration")}: {formatTime(dp.diveSeconds)}
                  </div>
                  <div>{t("stats.surfaceTime")}: {formatTime(dp.rawSurface)}</div>
                </div>
              );
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="diveSeconds"
            name={t("stats.diveDuration")}
            stroke="#8884d8"
            dot={range === "days" ? { r: 3 } : false}
          />
          <Line
            type="monotone"
            dataKey="surfaceSeconds"
            name={t("stats.surfaceTime")}
            stroke="#82ca9d"
            dot={range === "days" ? { r: 3 } : false}
          />
        </LineChart>
      </ResponsiveContainer>

      {filteredData.length > 2 && (
        <CorrelationNote
          data={filteredData}
          xKey="rawSurface"
          yKey="diveSeconds"
          t={t}
        />
      )}
    </div>
  );
};

export default DiveTimeVsSurfaceChart;
