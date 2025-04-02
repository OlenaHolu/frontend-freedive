import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const DiveCard = ({ dive, onDiveUpdated, onOpenModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white text-black rounded-lg p-4 shadow relative">
      <p><strong>📅 {new Date(dive.StartTime).toLocaleString()}</strong></p>
      <p>🌊 {t("dive.maxDepth")}: {dive.MaxDepth} m</p>
      <p>🕒 {t("dive.duration")}: {formatDuration(dive.Duration)}</p>

      <div className="mt-4 flex gap-2">

        <button
          onClick={() => navigate(`/dashboard/dives/${dive.id}`)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          🔍 {t("dive.view")}
        </button>

        <button
          onClick={() => navigate(`/dashboard/dives/edit/${dive.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          ✏️ {t("dive.edit")}
        </button>
      </div>
    </div>
  );
}

export default React.memo(DiveCard);
