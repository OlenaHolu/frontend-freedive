import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function DiveDetailsModal({ dive, isOpen, onClose }) {
  if (!dive) return null;
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">{t("dive.diveDetails")}</h2>
      <p><strong>{t("dive.startTime")}:</strong> {dive.StartTime}</p>
      <p><strong>{t("dive.maxDepth")}:</strong> {dive.MaxDepth} m</p>
      <p><strong>{t("dive.duration")}:</strong> {dive.Duration} min</p>
      <p><strong>{t("dive.temp")}:</strong> {dive.StartTemperature}° ➝ {dive.BottomTemperature}° ➝ {dive.EndTemperature}°</p>
      <p><strong>{t("dive.previousMax")}:</strong> {dive.PreviousMaxDepth} m</p>
      <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">{t("close")}</button>
    </Modal>
  );
}
