import { useEffect, useState } from "react";
import { getDives } from "../api/dive";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import DiveTimeVsSurfaceChart from "../components/stats/DiveTimeVsSurfaceChart.jsx";
import AverageDiveTimeVsSurfaceChart from "../components/stats/AverageDiveTimeVsSurfaceChart.jsx";
import UnderwaterPieChart from "../components/stats/UnderwaterPieChart.jsx";
import DepthOverTimeChart from "../components/stats/DepthOverTimeChart";
import DivesPerDateChart from "../components/stats/DivesPerDateChart.jsx";

const TABS = [
  { key: "time", label: "Dive Time & Surface" },
  { key: "date", label: "Date Analysis" },
  { key: "performance", label: "Performance" },
  { key: "progress", label: "Progress" }
];

const StatsPage = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const [dives, setDives] = useState([]);
  const [loadingDives, setLoadingDives] = useState(true);
  const [activeTab, setActiveTab] = useState("time");

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
    .filter((d) => d.StartTime && d.MaxDepth)
    .sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime))
    .map((dive) => ({
      date: new Date(dive.StartTime).toLocaleDateString(),
      depth: Number(dive.MaxDepth),
      time: Number(dive.Duration || 0),
    }));



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
      {dives.length === 0 ? (
        <p className="text-gray-500">{t("divesList.noDives")}</p>
      ) : (
        <>
          {activeTab === "time" && (
            <div className="flex flex-col space-y-6">
              <DiveTimeVsSurfaceChart dives={dives} t={t} />
              <AverageDiveTimeVsSurfaceChart dives={dives} t={t} />
            </div>
          )}

          {activeTab === "date" && 
          <DivesPerDateChart dives={dives} t={t} />
          }

          {activeTab === "performance" && (
            <UnderwaterPieChart totalDive={totalDive} totalSurface={totalSurface} t={t}
            />
          )}

          {activeTab === "progress" && (
            <DepthOverTimeChart data={chartData} t={t} />
          )}
        </>
      )}
    </div>
  );
};

export default StatsPage;