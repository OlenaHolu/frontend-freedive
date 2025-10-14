import { useEffect, useState } from "react";
import { getDives } from "../../api/dive";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import DiveTimeVsSurfaceChart from "./DiveTimeVsSurfaceChart.jsx";
import AverageDiveTimeVsSurfaceChart from "./AverageDiveTimeVsSurfaceChart.jsx.jsx";
import DepthOverTimeChart from "./DepthOverTimeChart.jsx";
import DivesPerDateChart from "./DivesPerDateChart.jsx";
import UnderwaterComparison from "./UnderwaterComparison.jsx";

const StatsPage = () => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const TABS = [
    { key: "time", label: t("stats.tabs.diveVsSurface") },
    { key: "date", label: t("stats.tabs.diveCount") },
    { key: "performance", label: t("stats.tabs.performance") },
    { key: "progress", label: t("stats.tabs.progress") },
  ];

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

  if (loading || loadingDives || !user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 text-lg font-semibold">
        {t("loading")}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{t("stats.title")}</h2>

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
            <UnderwaterComparison dives={dives} t={t}
            />
          )}

          {activeTab === "progress" && (
            <DepthOverTimeChart dives={dives} t={t} />
          )}
        </>
      )}
    </div>
  );
};

export default StatsPage;