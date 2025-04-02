import { useCallback, useEffect, useState } from "react";
import { getDives } from "../api/dive";
import DiveCard from "../components/DiveCard";
import DiveSearch from "../components/DiveSearch";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { formatDuration } from "../utils/time";
import { filterByPeriod, filterBySearch } from "../utils/diveFilters";
import Swal from "sweetalert2";
import DiveDetailsModal from "../components/modals/DiveDetailsModal";
import DiveChartModal from "../components/modals/DiveChartModal";
import { getDiveById } from "../api/dive";
import { useNavigate } from "react-router-dom";


export default function DiveListPage() {
    const { user, loading } = useAuth();
    const { t } = useTranslation();
    const [dives, setDives] = useState([]);
    const [allDives, setAllDives] = useState([]);
    const [loadingDives, setLoadingDives] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const divesPerPage = 10;
    const totalPages = Math.ceil(allDives.length / divesPerPage);
    const [activeDive, setActiveDive] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [diveSamples, setDiveSamples] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSamples = async () => {
            if (openModal === "chart" && activeDive) {
                try {
                    Swal.fire({
                        title: t("loading"),
                        text: t("dive.loadingChart"),
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    });
                    const res = await getDiveById(activeDive.id);
                    setDiveSamples(res.dive.samples);
                    Swal.close();
                } catch (err) {
                    console.error("Failed to load dive with samples", err);
                    Swal.fire({
                        icon: "error",
                        title: t("error"),
                        text: t("dive.errorLoadingChart"),
                    });
                }
            }
        };
        loadSamples();
    }, [openModal, activeDive]);

    const fetchDives = useCallback(async (query = searchQuery) => {
        try {
            setLoadingDives(true);
            const res = await getDives();

            let filtered = res.dives.sort((a, b) => new Date(b.StartTime) - new Date(a.StartTime));
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

    const handleCloseModal = () => {
        setActiveDive(null);
        setOpenModal(null);
    };


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

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <DiveSearch onSearch={handleSearch} />

                {(searchQuery.trim() !== "" || period !== "all") && (
                    <div className="mt-2">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                        >
                            {t("divesList.clearFilters")}
                        </button>
                    </div>
                )}

                {/* Period Filter */}
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 rounded ${period === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setPeriod("all")}
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
                <div className="text-center text-gray-700 text-lg font-semibold">
                    {t("loading")}
                </div>
            ) : (
                <div>
                    <div className="grid gap-4">
                        {dives.length === 0 ? (
                            <p>{t("divesList.noDives")}</p>
                        ) : (
                            dives.map((dive) => (
                                <DiveCard
                                    key={dive.id}
                                    dive={dive}
                                    onDiveUpdated={fetchDives}
                                    onOpenModal={(type) => {
                                        setActiveDive(dive);
                                        setOpenModal(type);
                                    }}
                                />
                            ))
                        )}
                    </div>

                    {period === "all" && searchQuery.trim() === "" && totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 rounded ${currentPage === pageNum
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            )}

            {/* Modals */}
            {activeDive && openModal === "details" && (
                <DiveDetailsModal
                    dive={activeDive}
                    isOpen={true}
                    onClose={handleCloseModal}
                />
            )}

            {activeDive && openModal === "chart" && (
                <DiveChartModal
                    dive={activeDive}
                    diveMaxDepth={activeDive?.MaxDepth}
                    samples={diveSamples}
                    isOpen={true}
                    onClose={() => {
                        handleCloseModal();
                        setDiveSamples(null);
                    }}
                />
            )}
        </div>
    );
}
