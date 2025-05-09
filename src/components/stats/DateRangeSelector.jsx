import { useState } from "react";

const DateRangeSelector = ({
  range,
  setRange,
  selectedDate,
  setSelectedDate,
  years,
  t,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const changePeriod = (direction) => {
    const newDate = new Date(selectedDate);
    if (range === "months") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (range === "years") {
      newDate.setFullYear(newDate.getFullYear() + direction);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setSelectedDate(newDate);
  };

  const formatPeriodLabel = () => {
    if (range === "months") {
      return selectedDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    } else if (range === "years") {
      return selectedDate.getFullYear();
    }
    return selectedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDateSelect = (e) => {
    const value = e.target.value;
    let newDate;
    if (range === "months") {
      const [year, month] = value.split("-");
      newDate = new Date(Number(year), Number(month) - 1, 1);
    } else if (range === "years") {
      newDate = new Date(Number(value), 0, 1);
    } else {
      newDate = new Date(value);
    }
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="months">{t("stats.dateSelector.byMonth")}</option>
          <option value="days">{t("stats.dateSelector.byDay")}</option>
          <option value="years">{t("stats.dateSelector.byYear")}</option>
        </select>
      </div>

      <div className="flex items-center gap-2 relative">
        <button onClick={() => changePeriod(-1)} className="text-xl px-2">←</button>

        <span
          onClick={() => setShowCalendar((prev) => !prev)}
          className="font-semibold cursor-pointer hover:underline"
        >
          {formatPeriodLabel()}
        </span>

        {showCalendar && (
          <div className="absolute z-10 bg-white border rounded p-2 mt-2 shadow">
            {range === "months" ? (
              <select
                onChange={handleDateSelect}
                value={`${selectedDate.getFullYear()}-${String(
                  selectedDate.getMonth() + 1
                ).padStart(2, "0")}`}
                className="border p-1 w-full"
              >
                {years.map((year) =>
                  [...Array(12).keys()].map((m) => {
                    const month = String(m + 1).padStart(2, "0");
                    return (
                      <option key={`${year}-${month}`} value={`${year}-${month}`}>
                        {month}/{year}
                      </option>
                    );
                  })
                )}
              </select>
            ) : range === "years" ? (
              <select
                onChange={handleDateSelect}
                value={selectedDate.getFullYear()}
                className="border p-1 w-full"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="date"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={handleDateSelect}
                className="border p-1 w-full"
                max={new Date().toISOString().slice(0, 10)}
              />
            )}
          </div>
        )}

        <button onClick={() => changePeriod(1)} className="text-xl px-2">→</button>
      </div>
    </div>
  );
};

export default DateRangeSelector;
