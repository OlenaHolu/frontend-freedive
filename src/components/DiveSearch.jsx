import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function DiveSearch({ onSearch }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    onSearch(inputValue);
  };

  return (
    <div className="flex gap-2 w-full md:w-1/3">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={t("divesList.searchPlaceholder")}
        className="flex-1 p-2 border rounded"
      />
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {t("search")}
      </button>
    </div>
  );
}
