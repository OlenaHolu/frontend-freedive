import { useState, useEffect, useRef } from "react";

const PeriodNavigator = ({ range, selectedDate, setSelectedDate, years, t }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const changePeriod = (direction) => {
    const newDate = new Date(selectedDate);
    if (range === "months" || range === "daily") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (range === "years" || range === "monthly") {
      newDate.setFullYear(newDate.getFullYear() + direction);
    } else if (range === "days") {
      newDate.setDate(newDate.getDate() + direction);
    }
    setSelectedDate(newDate);
  };

  const formatPeriodLabel = () => {
    const year = selectedDate.getFullYear();
    if (range === "months") {
      return selectedDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    } else if (range === "years") {
      return selectedDate.getFullYear();
    } else if (range === "days") {
      return selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } else if (range === "monthly") {
      return `${year}`;
    } else if (range === "daily") {
      return selectedDate.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });
    }
    return "";
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
    <div 
      className="flex items-center gap-2 relative"
      ref={calendarRef}
    >
      <button onClick={() => changePeriod(-1)} className="text-xl px-2">←</button>

      <span
        onClick={() => setShowCalendar((prev) => !prev)}
        className="font-semibold cursor-pointer hover:underline"
      >
        {formatPeriodLabel()}
      </span>

      {showCalendar && (
        <div className="absolute z-10 bg-white border rounded p-2 mt-2 shadow">
          {range === "months" || range === "daily" ? (
            <select
              onChange={handleDateSelect}
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`}
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
          ) : range === "years" || range === "monthly"? (
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
  );
};

export default PeriodNavigator;
