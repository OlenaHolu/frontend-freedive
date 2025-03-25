import Modal from "react-modal";
import DiveForm from "../DiveForm";

Modal.setAppElement("#root");

export default function EditDiveModal({ dive, isOpen, onClose, onDiveUpdated }) {
  if (!dive) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">✏️ Edit Dive</h2>

      <DiveForm
        editMode
        initialData={dive}
        onClose={() => {
          {onClose};
          if (onDiveUpdated) onDiveUpdated();
        }}
      />

      <button onClick={onClose} className="mt-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
        Cancel
      </button>
    </Modal>
  );
}
