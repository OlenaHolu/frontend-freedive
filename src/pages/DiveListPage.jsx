import { useCallback, useEffect, useState } from "react";
import { getDives } from "../api/dive";
import DiveSearch from "../components/DiveSearch";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { formatDuration } from "../utils/time";
import { filterByPeriod, filterBySearch } from "../utils/diveFilters";
import { useNavigate } from "react-router-dom";

export default function DiveListPage() {
    const { user, loading } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [dives, setDives] = useState([]);
    const [allDives, setAllDives] = useState([]);
    const [loadingDives, setLoadingDives] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("StartTime");
    const [sortDirection, setSortDirection] = useState("desc"); // o "asc"


    const divesPerPage = 10;
    const totalPages = Math.ceil(allDives.length / divesPerPage);

    const fetchDives = useCallback(async (query = searchQuery) => {
        try {
            setLoadingDives(true);
            const res = await getDives();

            let filtered = res.dives.sort(
                (a, b) => new Date(b.StartTime) - new Date(a.StartTime)
            );
            setAllDives(filtered);

            filtered = filterByPeriod(filtered, period);
            filtered = filterBySearch(filtered, query, formatDuration);

            if (period === "all" && query.trim() === "") {
                const startIndex = (currentPage - 1) * divesPerPage;
                const endIndex = startIndex + divesPerPage;
                filtered = filtered.slice(startIndex, endIndex);
            }

            setDives(filtered);
        } catch (err) {
            console.error("Error fetching dives:", err);
        } finally {
            setLoadingDives(false);
        }
    }, [period, currentPage, searchQuery]);

    useEffect(() => {
        if (user) fetchDives();
    }, [user, period, currentPage]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchDives(query);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setPeriod("all");
        setCurrentPage(1);
        fetchDives("");
    };

    if (loading || !user) {
        return (
            <div className="text-center text-gray-500 text-lg py-10">
                {t("loading")}
            </div>
        );
    }

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const getSortedDives = () => {
        return [...dives].sort((a, b) => {
            let valA = a[sortColumn];
            let valB = b[sortColumn];

            if (sortColumn === "StartTime") {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (sortColumn === "Duration" || sortColumn === "MaxDepth") {
                valA = Number(valA);
                valB = Number(valB);
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    };


    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6">📋 {t("divesList.title")}</h2>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <DiveSearch onSearch={handleSearch} />

                <div className="flex items-center gap-2 flex-wrap">
                    {["all", "7d", "30d"].map((p) => (
                        <button
                            key={p}
                            className={`px-4 py-2 rounded transition ${period === p
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setPeriod(p)}
                        >
                            {t(`divesList.filters.${p === "all" ? "all" : p === "7d" ? "last7" : "last30"}`)}
                        </button>
                    ))}

                    {(searchQuery || period !== "all") && (
                        <button
                            onClick={resetFilters}
                            className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                        >
                            {t("divesList.clearFilters")}
                        </button>
                    )}
                </div>
            </div>

            {/* List or Loading */}
            {loadingDives ? (
                <div className="text-center text-gray-500 text-lg">{t("loading")}</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        {dives.length === 0 ? (
                            <p className="text-center text-gray-600 italic">{t("divesList.noDives")}</p>
                        ) : (
                            <table className="min-w-full border divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100 text-left text-sm text-gray-600">
                                    <tr>
                                        <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("StartTime")}>
                                            📅 {t("dive.details.startTime")} {sortColumn === "StartTime" && (sortDirection === "asc" ? "▲" : "▼")}
                                        </th>
                                        <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("MaxDepth")}>
                                            🌊 {t("dive.details.maxDepth")} {sortColumn === "MaxDepth" && (sortDirection === "asc" ? "▲" : "▼")}
                                        </th>
                                        <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("Duration")}>
                                            🕒 {t("dive.details.duration")} {sortColumn === "Duration" && (sortDirection === "asc" ? "▲" : "▼")}
                                        </th>
                                        <th className="px-4 py-2">{t("actions")}</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-100">
                                    {getSortedDives().map((dive) => (
                                        <tr key={dive.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                {new Date(dive.StartTime).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2">{dive.MaxDepth} m</td>
                                            <td className="px-4 py-2">{formatDuration(dive.Duration)}</td>
                                            <td className="px-4 py-2 space-x-2">
                                                <button
                                                    onClick={() => navigate(`/dashboard/dives/${dive.id}`)}
                                                    className="text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                                >
                                                    🔍 {t("dive.view")}
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/dashboard/dives/edit/${dive.id}`)}
                                                    className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                >
                                                    ✏️ {t("dive.edit")}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>


                    {/* Pagination */}
                    {period === "all" && !searchQuery && totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 rounded ${currentPage === pageNum
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
