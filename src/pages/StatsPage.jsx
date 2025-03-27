import { useEffect, useState } from "react";
import { getDives } from "../api/dive";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const StatsPage = () => {
  const { user, loading } = useAuth();
  const [dives, setDives] = useState([]);
  const [loadingDives, setLoadingDives] = useState(true);
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
      depth: Number(dive.MaxDepth)
    }));

  if (loading || loadingDives || !user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 text-lg font-semibold">
        {t("loading")}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">📈 {t("stats.title")}</h2>

      {chartData.length === 0 ? (
        <p className="text-gray-500">{t("divesList.noDives")}</p>
      ) : (
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
      )}
    </div>
  );
};

export default StatsPage;
