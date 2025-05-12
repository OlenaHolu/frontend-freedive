import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";
import SummaryStatsPanel from "./SummaryStatsPanel";

const UnderwaterPieChart = ({ dives, t }) => {
  const totalDive = dives.reduce((sum, d) => sum + (d.Duration || 0), 0) / 60;
  const totalSurface = dives.reduce((sum, d) => sum + (d.SurfaceTime || 0), 0) / 60;

  const data = [
    { name: t("stats.underwater"), value: totalDive },
    { name: t("stats.surface"), value: totalSurface }
  ];

  const colors = ["#00bcd4", "#ff9800"];

  const renderCustomLabel = ({ percent }) =>
    `${(percent * 100).toFixed(1)}%`;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {t("stats.underwaterVsSurfaceTitle")}
      </h3>

      <div className="flex gap-4 text-sm mb-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value.toFixed(1)} min`}
          />
        </PieChart>
      </ResponsiveContainer>

      <SummaryStatsPanel
        totalDive={totalDive}
        totalSurface={totalSurface}
        t={t}
      />
    </div>
  );
};

export default UnderwaterPieChart;
