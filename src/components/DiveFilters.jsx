import DiveSearch from "./DiveSearch";
import PeriodFilter from "./PeriodFilter";

export default function DiveFilters({ onSearch, searchQuery, period, onChangePeriod, onClear, t }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <DiveSearch onSearch={onSearch} />

      <div className="flex items-center gap-2 flex-wrap">
        <PeriodFilter period={period} setPeriod={onChangePeriod} t={t} />

        {(searchQuery || period !== "all") && (
          <button
            onClick={onClear}
            className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
          >
            {t("divesList.clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}
