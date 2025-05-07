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

const DivesPerDateChart = ({ dives, t }) => {
    const [range, setRange] = useState("monthly");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const changePeriod = (direction) => {
        const newDate = new Date(selectedDate);
        if (range === "daily") {
            newDate.setMonth(newDate.getMonth() + direction); // ⬅ cambia a mes
        } else if (range === "monthly") {
            newDate.setFullYear(newDate.getFullYear() + direction);
        }
        setSelectedDate(newDate);
    };


    const formatPeriodLabel = () => {
        const month = selectedDate.toLocaleString("default", { month: "short" });
        const year = selectedDate.getFullYear();

        if (range === "daily") {
            return `${month} ${year}`;
        }
        if (range === "monthly") {
            return `${year}`;
        }
        return "";
    };

    // === 📊 DATA PREPARATION ===
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
        chartData = groupBy(dives, (date) => {
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            return `${mm}/${date.getFullYear()}`;
        });
    }

    if (range === "yearly") {
        chartData = groupBy(dives, (date) => `${date.getFullYear()}`);
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">
                {t("Total Dives per Day")}
            </h3>

            {/* === Filtro + Navegación === */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="daily">{t("Daily")}</option>
                        <option value="monthly">{t("Monthly")}</option>
                        <option value="yearly">{t("Yearly")}</option>
                    </select>
                </div>

                {range !== "yearly" && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => changePeriod(-1)} className="text-xl px-2">←</button>
                        <span className="font-semibold">{formatPeriodLabel()}</span>
                        <button onClick={() => changePeriod(1)} className="text-xl px-2">→</button>
                    </div>
                )}

            </div>

            {/* === Bar Chart === */}
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
