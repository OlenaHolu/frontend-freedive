import { useEffect, useState } from "react";
import { getDives } from "../api/dive";
import DiveCard from "../components/DiveCard";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function DiveListPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [dives, setDives] = useState([]);
  const [loadingDives, setLoadingDives] = useState(true);

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("default"); // 'default' = last 20 dives

  const fetchDives = async () => {
    try {
      setLoadingDives(true);
      const res = await getDives();
      let filtered = res.dives;

      // Default: show only last 20 dives
      if (period === "default") {
        filtered = filtered.slice(-20).reverse();
      }

      // Filter by period
      if (period === "7d") {
        const date7 = new Date();
        date7.setDate(date7.getDate() - 7);
        filtered = filtered.filter(d => new Date(d.StartTime) >= date7);
      }
      if (period === "30d") {
        const date30 = new Date();
        date30.setDate(date30.getDate() - 30);
        filtered = filtered.filter(d => new Date(d.StartTime) >= date30);
      }

      // Search by date/depth/duration
      if (search.trim() !== "") {
        const q = search.toLowerCase();
        filtered = filtered.filter(dive =>
          dive.MaxDepth.toString().includes(q) ||
          dive.Duration.toString().includes(q) ||
          new Date(dive.StartTime).toLocaleDateString().includes(q)
        );
      }

      setDives(filtered);
    } catch (err) {
      console.error("Error fetching dives:", err);
    } finally {
      setLoadingDives(false);
    }
  };

  useEffect(() => {
    if (user) fetchDives();
  }, [user, period, search]);

  if (loading || !user) {
    return (
      <div className="text-center text-gray-700 text-lg font-semibold">
        {t("loading")}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">📋 {t("divesList.title")}</h2>

      {/* 🔍 Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder={t("divesList.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${period === "default" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPeriod("default")}
          >
            {t("divesList.filters.all")}
          </button>
          <button
            className={`px-4 py-2 rounded ${period === "7d" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPeriod("7d")}
          >
            {t("divesList.filters.last7")}
          </button>
          <button
            className={`px-4 py-2 rounded ${period === "30d" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPeriod("30d")}
          >
            {t("divesList.filters.last30")}
          </button>
        </div>
      </div>

      {/* ⏳ Loading */}
      {loadingDives ? (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-600 animate-pulse w-1/2 rounded-full" />
        </div>
      ) : (
        <div className="grid gap-4">
          {dives.length === 0 ? (
            <p>{t("divesList.noDives")}</p>
          ) : (
            dives.map((dive) => (
              <DiveCard key={dive.id} dive={dive} onDiveUpdated={fetchDives} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
