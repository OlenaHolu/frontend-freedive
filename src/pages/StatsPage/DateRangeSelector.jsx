const DateRangeSelector = ({ range, setRange, t, mode = "date" }) => {
  const options =
    mode === "report"
      ? [
        { value: "monthly", label: t("stats.dateSelector.monthly") },
        { value: "daily", label: t("stats.dateSelector.daily") },
        { value: "yearly", label: t("stats.dateSelector.yearly") },
      ]
      : [
        { value: "months", label: t("stats.dateSelector.byMonth") },
        { value: "days", label: t("stats.dateSelector.byDay") },
        { value: "years", label: t("stats.dateSelector.byYear") },
      ];

  return (
    <div className="flex items-center gap-4">
      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export default DateRangeSelector;
