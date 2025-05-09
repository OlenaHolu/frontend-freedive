import { useState, useMemo } from "react";
import DateRangeSelector from "./DateRangeSelector";
import PeriodNavigator from "./PeriodNavigator";
import UnderwaterPieChart from "./UnderwaterPieChart";

const UnderwaterComparison = ({ dives, t }) => {
  const [range, setRange] = useState("months");
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      {/* Título general */}
      <h2 className="text-2xl font-bold mb-6">{t("stats.underwaterVsSurfaceTitle")}</h2>

      {/* Filtros y periodo */}
      <div className="flex flex-col lg::flex-row justify-between items-start lg:items-center gap-4 mb-6">
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

      {/* Gráficos en paralelo */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Gráfico filtrado */}
        <div className="lg:w-1/2 w-full bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            {t("stats.filteredPeriod")}: <span className="text-gray-900">{formatPeriodLabel()}</span>
          </h3>
          <UnderwaterPieChart dives={filteredDives} t={t} />
        </div>

        {/* Gráfico general */}
        <div className="lg:w-1/2 w-full bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            {t("stats.allTime")}
          </h3>
          <UnderwaterPieChart dives={dives} t={t} />
        </div>
      </div>
    </div>
  );
};

export default UnderwaterComparison;
