import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function DiveDetailsModal({ dive, isOpen, onClose }) {
  if (!dive) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Dive Details</h2>
      <p><strong>Start Time:</strong> {dive.StartTime}</p>
      <p><strong>Max Depth:</strong> {dive.MaxDepth} m</p>
      <p><strong>Duration:</strong> {dive.Duration} min</p>
      <p><strong>Temperature:</strong> {dive.StartTemperature}° ➝ {dive.BottomTemperature}° ➝ {dive.EndTemperature}°</p>
      <p><strong>Previous Max Depth:</strong> {dive.PreviousMaxDepth} m</p>
      <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Close</button>
    </Modal>
  );
}
