import { useState, useMemo, useEffect } from "react";
import DateRangeSelector from "./DateRangeSelector";
import PeriodNavigator from "./PeriodNavigator";
import UnderwaterPieChart from "./UnderwaterPieChart";

const UnderwaterComparison = ({ dives, t }) => {
  const [range, setRange] = useState("months");
  const [selectedDate, setSelectedDate] = useState(new Date());

   useEffect(() => {
      if (dives.length > 0) {
        const latestDive = dives.reduce((latest, current) => {
          const latestTime = new Date(latest.StartTime).getTime();
          const currentTime = new Date(current.StartTime).getTime();
          return currentTime > latestTime ? current : latest;
        });
  
        const latestDate = new Date(latestDive.StartTime);
        const defaultDate =
          range === "months"
            ? new Date(latestDate.getFullYear(), latestDate.getMonth(), 1)
            : range === "years"
              ? new Date(latestDate.getFullYear(), 0, 1)
              : latestDate;
  
        setSelectedDate(defaultDate);
      }
    }, [dives, range]); 

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

  const filteredDives = useMemo(() => {
    return dives.filter((d) => {
      const diveDate = new Date(d.StartTime);
      if (range === "days") {
        return diveDate.toDateString() === selectedDate.toDateString();
      }
      if (range === "months") {
        return (
          diveDate.getFullYear() === selectedDate.getFullYear() &&
          diveDate.getMonth() === selectedDate.getMonth()
        );
      }
      if (range === "years") {
        return diveDate.getFullYear() === selectedDate.getFullYear();
      }
      return true;
    });
  }, [dives, range, selectedDate]);

  const formatPeriodLabel = () => {
    if (range === "days") {
      return selectedDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
    if (range === "months") {
      return selectedDate.toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric"
      });
    }
    if (range === "years") {
      return selectedDate.getFullYear();
    }
    return "";
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">{t("stats.underwaterVsSurfaceTitle")}</h2>

      <div className="flex flex-col lg::flex-row justify-between items-start gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <DateRangeSelector range={range} setRange={setRange} t={t} />
          <PeriodNavigator
            range={range}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            years={years}
            t={t}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtred Chart */}
        <div className="lg:w-1/2 w-full bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-500 mb-2">
            {t("stats.filteredPeriod")}
          </h3>
          <UnderwaterPieChart dives={filteredDives} t={t} />
        </div>

        {/* Main Chart */}
        <div className="lg:w-1/2 w-full bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-500 mb-2">
            {t("stats.allTime")}
          </h3>
          <UnderwaterPieChart dives={dives} t={t} />
        </div>
      </div>
      <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-900 whitespace-pre-line">
  <div className="flex items-start gap-2">
    <svg
      className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
    <span>{t("stats.recoveryRatioExplanation")}</span>
  </div>
</div>

    </div>
  );
};

export default UnderwaterComparison;
