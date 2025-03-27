import { useState } from "react";
import DiveDetailsModal from "./modals/DiveDetailsModal";
import EditDiveModal from "./modals/EditDiveModal";
import DiveChartModal from "./modals/DiveChartModal";
import { useTranslation } from "react-i18next";
import { getDiveById } from "../api/dive";
import Swal from "sweetalert2";

export default function DiveCard({ dive, onDiveUpdated }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [diveWithSamples, setDiveWithSamples] = useState(null);
  const { t } = useTranslation();

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOpenChart = async () => {
    try {
      Swal.fire({
        title: t("loading"),
        text: t("dive.loadingChart"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await getDiveById(dive.id);
      const fullDive = res.dive;

      setDiveWithSamples(fullDive);
      setShowChart(true);
      Swal.close();
    } catch (err) {
      console.error("Failed to load dive with samples", err);
    }
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
          onClick={handleOpenChart}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          🔍 {t("dive.viewChart")}
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

      {/* 📉 Modal de Perfil */}
      {diveWithSamples && (
        <DiveChartModal
          samples={diveWithSamples.samples}
          isOpen={showChart}
          onClose={() => {
            setShowChart(false);
            setDiveWithSamples(null);
          }}
        />
      )}

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
