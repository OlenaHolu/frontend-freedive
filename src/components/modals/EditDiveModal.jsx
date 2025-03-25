import Modal from "react-modal";
import DiveForm from "../DiveForm";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

export default function EditDiveModal({ dive, isOpen, onClose, onDiveUpdated }) {
  if (!dive) return null;
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">✏️ {t("dive.editDive")}</h2>

      <DiveForm
        editMode
        initialData={dive}
        onClose={() => {
          {onClose};
          if (onDiveUpdated) onDiveUpdated();
        }}
      />

      <button onClick={onClose} className="mt-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
        {t("close")}
      </button>
    </Modal>
  );
}
