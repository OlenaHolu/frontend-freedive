import { useState } from "react";

const YearSelector = ({ years, selectedYear, setSelectedYear }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const changeYear = (direction) => {
    const index = years.indexOf(selectedYear);
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < years.length) {
      setSelectedYear(years[newIndex]);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <button onClick={() => changeYear(-1)} className="text-xl px-2">←</button>

      <span
        onClick={() => setShowDropdown(prev => !prev)}
        className="cursor-pointer font-semibold hover:underline"
      >
        {selectedYear}
      </span>

      {showDropdown && (
        <select
          onChange={(e) => {
            setSelectedYear(Number(e.target.value));
            setShowDropdown(false);
          }}
          value={selectedYear}
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 border rounded p-1 bg-white shadow z-10"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      )}

      <button onClick={() => changeYear(1)} className="text-xl px-2">→</button>
    </div>
  );
};

export default YearSelector;
