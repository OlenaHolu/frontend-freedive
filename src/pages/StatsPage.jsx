import { useEffect, useState } from "react";
import { getDives } from "../api/dive";
import {
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "time", label: "Dive Time & Surface" },
  { key: "date", label: "Date Analysis" },
  { key: "performance", label: "Performance" },
  { key: "progress", label: "Progress" }
];

const StatsPage = () => {
  const { user, loading } = useAuth();
  const [dives, setDives] = useState([]);
  const [loadingDives, setLoadingDives] = useState(true);
  const [activeTab, setActiveTab] = useState("time");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDives = async () => {
      try {
        setLoadingDives(true);
        const data = await getDives();
        setDives(data.dives || []);
      } catch (err) {
        console.error("Error fetching dives:", err);
      } finally {
        setLoadingDives(false);
      }
    };

    if (user) fetchDives();
  }, [user]);

  const chartData = dives
    .filter(d => d.StartTime && d.MaxDepth)
    .sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
    .map((dive) => ({
      date: new Date(dive.StartTime).toLocaleDateString(),
      depth: Number(dive.MaxDepth),
      time: Number(dive.Duration || 0),
    }));

    const formatTime = (seconds) => {
      const total = Math.round(seconds); // 🔧 redondeo aquí
      const min = Math.floor(total / 60);
      const sec = total % 60;
      return `${min}:${sec.toString().padStart(2, '0')}`;
    };
    

  const lineChartData = dives
    .filter(d => d.SurfaceTime != null && d.Duration != null && d.StartTime)
    .sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
    .map(d => {
      const dateObj = new Date(d.StartTime);
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const yy = String(dateObj.getFullYear()).slice(-2);
      return {
        shortDate: `${mm}/${yy}`, // para eje X
        fullDate: dateObj.toLocaleDateString(undefined, {
          day: 'numeric', month: 'short', year: 'numeric'
        }),
        diveSeconds: d.Duration,
        surfaceSeconds: d.SurfaceTime,
      };
    });


  const formatMinutesOnly = (seconds) => Math.floor(seconds / 60);


  const groupedByDate = {};
  dives.forEach(d => {
    const date = new Date(d.StartTime).toLocaleDateString();
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(d);
  });

  const avgSessionData = Object.entries(groupedByDate).map(([date, entries]) => {
    const avgSurface = entries.reduce((sum, d) => sum + (d.SurfaceTime || 0), 0) / entries.length;
    const avgDive = entries.reduce((sum, d) => sum + (d.Duration || 0), 0) / entries.length;
  
    return {
      date,
      avgSurface: avgSurface, 
      avgDive: avgDive
    };
  });
  

  const totalDive = chartData.reduce((sum, d) => sum + d.time, 0);
  const totalSurface = dives.reduce((sum, d) => sum + (d.SurfaceTime || 0), 0) / 60;

  if (loading || loadingDives || !user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 text-lg font-semibold">
        {t("loading")}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">📈 Stats</h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-4 font-medium ${activeTab === tab.key
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {chartData.length === 0 ? (
        <p className="text-gray-500">{t("divesList.noDives")}</p>
      ) : (
        <>
          {activeTab === "time" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("Dive Time vs. Surface Time")}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shortDate" />
                    <YAxis
                      tickFormatter={formatMinutesOnly}
                      label={{ value: t("Minutes"), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      content={({ label, payload }) => {
                        if (!payload || payload.length === 0) return null;

                        const dataPoint = payload[0].payload;

                        return (
                          <div className="bg-white p-2 border rounded shadow text-sm text-gray-800">
                            <div><strong>{dataPoint.fullDate || label}</strong></div>
                            <div>{t("Dive Duration")}: {formatTime(dataPoint.diveSeconds)}</div>
                            <div>{t("Surface Time")}: {formatTime(dataPoint.surfaceSeconds)}</div>
                          </div>
                        );
                      }}
                    />

                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="diveSeconds"
                      name={t("Dive Duration")}
                      stroke="#8884d8"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="surfaceSeconds"
                      name={t("Surface Time")}
                      stroke="#82ca9d"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

              </div>

              <div>
  <h3 className="text-lg font-semibold mb-2">
    {t("Average Surface Time vs. Dive Time per Session")}
  </h3>
  <ResponsiveContainer width="100%" height={300}>
  <LineChart data={avgSessionData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="date"
      angle={-45}
      textAnchor="end"
      height={60}
    />
    <YAxis 
      tickFormatter={(seconds) => Math.floor(seconds / 60)}
      label={{ value: t("Minutes"), angle: -90, position: 'insideLeft' }} 
    />
    <Tooltip 
      formatter={(value) => formatTime(value)} // ✅ min:sec
      labelFormatter={(label) => `${t("Session Date")}: ${label}`}
    />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="avgDive" 
      name={t("Avg Dive Time")} 
      stroke="#8884d8" 
      dot={{ r: 3 }}
    />
    <Line 
      type="monotone" 
      dataKey="avgSurface" 
      name={t("Avg Surface Time")} 
      stroke="#82ca9d" 
      dot={{ r: 3 }}
    />
  </LineChart>
</ResponsiveContainer>

</div>

            </div>
          )}

          {activeTab === "date" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("Total Dives per Day")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Bar dataKey="depth" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "performance" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("Underwater vs. Surface Time (Proportion)")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Underwater", value: totalDive },
                      { name: "Surface", value: totalSurface }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell fill="#00bcd4" />
                    <Cell fill="#ff9800" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "progress" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("Max Depth Over Time")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Line
                    type="monotone"
                    dataKey="depth"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default StatsPage;
