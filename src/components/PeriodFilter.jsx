export default function PeriodFilter({ period, setPeriod, t }) {
    const options = [
      { key: "all", label: t("divesList.filters.all") },
      { key: "7d", label: t("divesList.filters.last7") },
      { key: "30d", label: t("divesList.filters.last30") },
    ];
  
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {options.map(({ key, label }) => (
          <button
            key={key}
            className={`px-4 py-2 rounded transition ${
              period === key ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setPeriod(key)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }
  