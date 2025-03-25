import { useState } from "react";
import DiveDetailsModal from "./modals/DiveDetailsModal";
import EditDiveModal from "./modals/EditDiveModal";

export default function DiveCard({ dive, onDiveUpdated }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="bg-white text-black rounded-lg p-4 shadow relative">
      <p><strong>📅 {new Date(dive.StartTime).toLocaleString()}</strong></p>
      <p>🌊 Depth: {dive.MaxDepth} m</p>
      <p>🕒 Duration: {dive.Duration} min</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowDetails(true)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          🔍 View
        </button>
        <button
          onClick={() => setShowEdit(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          ✏️ Edit
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
