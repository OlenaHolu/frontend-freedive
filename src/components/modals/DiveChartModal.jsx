import React from "react";
import Modal from "react-modal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

export default function DiveChartModal({ samples, isOpen, onClose }) {
  const { t } = useTranslation();

  if (!samples) return null;

  // Preprocesamiento
  let formattedSamples = samples
    .filter((s) => s.depth !== null && s.depth !== undefined && !isNaN(s.depth))
    .map((s) => ({
      time: s.time,
      depth: parseFloat(Number(s.depth).toFixed(2)),
    }))
    .sort((a, b) => a.time - b.time);

  // Añadir 0 al inicio
  if (formattedSamples.length > 0 && formattedSamples[0].depth !== 0) {
    formattedSamples.unshift({
      time: t("dive.start"),
      depth: 0,
    });
  }

  // Añadir 0 al final
  if (formattedSamples.length > 1 && formattedSamples[formattedSamples.length - 1].depth !== 0) {
    formattedSamples.push({
      time: formattedSamples[formattedSamples.length - 1].time + 1,
      depth: 0,
    });
  }

  if (formattedSamples.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4">{t("dive.diveChartTitle")}</h2>
        <p>{t("dive.noValidSamples")}</p>
        <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {t("close")}
        </button>
      </Modal>
    );
  }

  // Detectar profundidad máxima
  const maxDepthValue = Math.max(...formattedSamples.map((s) => s.depth));

  // Punto personalizado para maxDepth
  const renderCustomDot = ({ cx, cy, payload }) => {
    if (payload.depth === maxDepthValue) {
      return (
        <>
          <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#b91c1c" strokeWidth={2} />
          <text
            x={cx + 10}
            y={cy - 10}
            fontSize={12}
            fill="#b91c1c"
            fontWeight="bold"
          >
            {t("dive.maxDepthLabel")} {payload.depth} m
          </text>
        </>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">{t("dive.diveChartTitle")}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedSamples}>
          <XAxis
            dataKey="time"
            label={{
              value: t("dive.time") + " (s)",
              position: "insideBottom",
              offset: -5,
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, "dataMax + 2"]}
            reversed={true}
            label={{
              value: t("dive.depth") + " (m)",
              angle: -90,
              position: "insideLeft",
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "depth" ? [`${value} m`, t("dive.depth")] : value
            }
          />
          <Line
            type="monotone"
            dataKey="depth"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={renderCustomDot}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t("close")}
        </button>
      </div>
    </Modal>
  );
}
