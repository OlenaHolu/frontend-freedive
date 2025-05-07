import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer
  } from "recharts";
  
  const UnderwaterPieChart = ({ totalDive, totalSurface, t }) => {
    const data = [
      { name: t("Underwater"), value: totalDive },
      { name: t("Surface"), value: totalSurface }
    ];
  
    const colors = ["#00bcd4", "#ff9800"];
  
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {t("Underwater vs. Surface Time (Proportion)")}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default UnderwaterPieChart;
  