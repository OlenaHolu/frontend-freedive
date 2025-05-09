import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import DateRangeSelector from "./DateRangeSelector";
import PeriodNavigator from "./PeriodNavigator";

const DivesPerDateChart = ({ dives, t }) => {
    const [range, setRange] = useState("monthly");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

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

    const groupBy = (dives, keyFn) => {
        const counts = {};
        dives.forEach(d => {
            const date = new Date(d.StartTime);
            const key = keyFn(date);
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.entries(counts).map(([date, count]) => ({ date, count }));
    };

    let chartData = [];

    if (range === "daily") {
        const dayMap = {};
        dives.forEach((d) => {
            const key = new Date(d.StartTime).toLocaleDateString("en-GB");
            dayMap[key] = (dayMap[key] || 0) + 1;
        });

        const days = getDaysOfMonth(
            selectedDate.getFullYear(),
            selectedDate.getMonth()
        );

        chartData = days.map((day) => ({
            date: day,
            count: dayMap[day] || 0,
        }));
    }

    if (range === "monthly") {
        const filtered = dives.filter(
            (d) => new Date(d.StartTime).getFullYear() === selectedDate.getFullYear()
        );

        chartData = groupBy(filtered, (date) => {
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            return `${mm}/${date.getFullYear()}`;
        });
    }

    if (range === "yearly") {
        chartData = groupBy(dives, (date) => `${date.getFullYear()}`);
    }

    if (range === "daily") {
        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (range === "monthly") {
        chartData.sort((a, b) => {
          const [aMonth, aYear] = a.date.split("/").map(Number);
          const [bMonth, bYear] = b.date.split("/").map(Number);
          return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
        });
      } else if (range === "yearly") {
        chartData.sort((a, b) => Number(a.date) - Number(b.date));
      }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">
                {t("stats.divePerDateTitle")}
            </h3>

            <div className="flex justify-between items-center mb-4">
                <DateRangeSelector
                    range={range}
                    setRange={setRange}
                    mode="report"
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
