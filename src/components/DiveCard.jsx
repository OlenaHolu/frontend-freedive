import { useState } from "react";
import DiveDetailsModal from "./modals/DiveDetailsModal";
import EditDiveModal from "./modals/EditDiveModal";
import { useTranslation } from "react-i18next";

export default function DiveCard({ dive, onDiveUpdated }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { t } = useTranslation();

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
          onClick={() => setShowDetails(true)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          🔍 {t("dive.view")}
        </button>
        <button
          onClick={() => setShowEdit(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          ✏️ {t("dive.edit")}
        </button>
      </div>

      {/* 🔍 Modal de Detalles */}
      <DiveDetailsModal
        dive={dive}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {/* ✏️ Modal de Edición */}
      <EditDiveModal
        dive={dive}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onDiveUpdated={onDiveUpdated}
      />
    </div>
  );
}
