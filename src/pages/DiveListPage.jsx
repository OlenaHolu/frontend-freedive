import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DivesTable from "../components/DivesTable";
import DiveSearch from "../components/DiveSearch";
import Pagination from "../components/Pagination";
import PeriodFilter from "../components/PeriodFilter";
import useDives from "../hooks/useDives";
import { deleteDive, deleteManyDives } from "../api/dive";
import Swal from "sweetalert2";

export default function DiveListPage() {
    const { user, loading } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("StartTime");
    const [sortDirection, setSortDirection] = useState("desc");
    const [selectedDives, setSelectedDives] = useState([]);

    const divesPerPage = 10;

    const {
        dives,
        loadingDives,
        totalPages,
        refetch: fetchDives,
    } = useDives(user, period, searchQuery, currentPage, divesPerPage);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setPeriod("all");
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const confirmAndDelete = async ({ ids, isMultiple }) => {
        const confirmed = await Swal.fire({
            title: isMultiple ? t("divesList.deleteMultipleConfirmation") : t("divesList.deleteConfirmation"),
            text: t("divesList.thisActionCannotBeUndone"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("confirm"),
            cancelButtonText: t("cancel"),
        });

        if (!confirmed.isConfirmed) return;

        try {
            Swal.fire({
                title: t("divesList.deleting"),
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            if (isMultiple) {
                await deleteManyDives(ids);
            } else {
                await deleteDive(ids[0]);
            }

            Swal.fire({
                icon: "success",
                title: t("divesList.deletionCompleted"),
                text: `${ids.length} ${t("divesList.divesDeleted")}`,
                timer: 2000,
                showConfirmButton: false,
            });

            if (isMultiple) setSelectedDives([]);

            fetchDives();
        } catch (err) {
            console.error("Delete error:", err);
            Swal.fire({
                icon: "error",
                title: t("divesList.deleteError"),
                text: t("divesList.failedToDelete"),
            });
        }
    };

    const handleDelete = (id) => confirmAndDelete({ ids: [id], isMultiple: false });
    const handleDeleteMultiple = () => confirmAndDelete({ ids: selectedDives, isMultiple: true });


    if (loading || !user) {
        return (
            <div className="text-center text-gray-500 text-lg py-10">
                {t("loading")}
            </div>
        );
    }

    return (
            <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 py-6">
              <h2 className="text-3xl font-bold mb-6">📋 {t("divesList.title")}</h2>
          
              <div className="flex-grow overflow-auto">
                {/* Search + Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <DiveSearch onSearch={handleSearch} />
          
                  <div className="flex items-center gap-2 flex-wrap">
                    <PeriodFilter period={period} setPeriod={setPeriod} t={t} />
          
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
          
                {/* Delete Selected Dives */}
                {selectedDives.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={handleDeleteMultiple}
                      disabled={loadingDives}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ❌ {t("divesList.deleteSelected")} ({selectedDives.length})
                    </button>
                  </div>
                )}
          
                {/* List or Loading */}
                {loadingDives ? (
                  <div className="text-center text-gray-500 text-lg">{t("loading")}</div>
                ) : (
                  <div className="overflow-x-auto">
                    {dives.length === 0 ? (
                      <p className="text-center text-gray-600 italic">{t("divesList.noDives")}</p>
                    ) : (
                      <DivesTable
                        dives={dives}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        handleDelete={handleDelete}
                        selectedDives={selectedDives}
                        setSelectedDives={setSelectedDives}
                      />
                    )}
                  </div>
                )}
              </div>
          
              {/* Pagination at the bottom */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => !loadingDives && setCurrentPage(page)}
                />
              </div>
            </div>          
    );
}
