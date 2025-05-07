import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
  } from "recharts";
  import { useState } from "react";
  
  const getWeekNumber = (date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
  };
  
  const getDaysOfMonth = (year, monthIndex) => {
    const days = [];
    const date = new Date(year, monthIndex, 1);
    while (date.getMonth() === monthIndex) {
      const str = date.toLocaleDateString("en-GB");
      days.push(str);
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  
  const groupBy = (dives, fn) => {
    const map = {};
    dives.forEach(dive => {
      const key = fn(new Date(dive.StartTime));
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([key, count]) => ({ date: key, count }));
  };
  
  const DivesPerDateChart = ({ dives, t }) => {
    const [range, setRange] = useState("monthly");
    const [selectedDate, setSelectedDate] = useState(new Date());
  
    const changePeriod = (direction) => {
      const newDate = new Date(selectedDate);
      if (range === "daily" || range === "weekly") {
        newDate.setDate(newDate.getDate() + direction * (range === "daily" ? 1 : 7));
      } else if (range === "monthly") {
        newDate.setMonth(newDate.getMonth() + direction);
      } else if (range === "yearly") {
        newDate.setFullYear(newDate.getFullYear() + direction);
      }
      setSelectedDate(newDate);
    };
  
    const formatPeriodLabel = () => {
      const m = selectedDate.toLocaleString("default", { month: "short" });
      const y = selectedDate.getFullYear();
      if (range === "daily" || range === "monthly") return `${m} ${y}`;
      if (range === "weekly") return `Week ${getWeekNumber(selectedDate)} / ${y}`;
      if (range === "yearly") return `${y}`;
      return "";
    };
  
    let chartData = [];
  
    if (range === "daily") {
      const dayMap = {};
      dives.forEach(d => {
        const key = new Date(d.StartTime).toLocaleDateString("en-GB");
        dayMap[key] = (dayMap[key] || 0) + 1;
      });
      const days = getDaysOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());
      chartData = days.map(d => ({ date: d, count: dayMap[d] || 0 }));
    } else if (range === "weekly") {
      chartData = groupBy(dives, d => {
        const week = getWeekNumber(d);
        return `W${week}/${d.getFullYear()}`;
      });
    } else if (range === "monthly") {
      chartData = groupBy(dives, d => {
        const m = String(d.getMonth() + 1).padStart(2, "0");
        return `${m}/${d.getFullYear()}`;
      });
    } else if (range === "yearly") {
      chartData = groupBy(dives, d => `${d.getFullYear()}`);
    }
  
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {t("Total Dives per Day")}
        </h3>
  
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="daily">{t("Daily")}</option>
              <option value="weekly">{t("Weekly")}</option>
              <option value="monthly">{t("Monthly")}</option>
              <option value="yearly">{t("Yearly")}</option>
            </select>
          </div>
  
          <div className="flex items-center gap-2">
            <button onClick={() => changePeriod(-1)} className="text-xl px-2">←</button>
            <span className="font-semibold">{formatPeriodLabel()}</span>
            <button onClick={() => changePeriod(1)} className="text-xl px-2">→</button>
          </div>
        </div>
  
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default DivesPerDateChart;
  