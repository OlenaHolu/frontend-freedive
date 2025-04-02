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

export default function DiveChartModal({ samples, isOpen, onClose, diveMaxDepth }) {
  const { t } = useTranslation();

  const modalClass =
    "bg-white rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl overflow-auto max-h-screen";
  const overlayClass =
    "fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50";

  if (!isOpen | !samples) return null;

  // Preprocesamiento
  let formattedSamples = samples
    .map((s) => {
      const time = Number(s.time);
      const depth = Number(s.depth);

      if (!isFinite(time) || !isFinite(depth) || depth < 0 || depth > 200) {
        return null;
      }

      return {
        time,
        depth: parseFloat(depth.toFixed(2)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.time - b.time);

  // Detectar max depth real y tiempo correspondiente
  const maxDepthInSamples = Math.max(...formattedSamples.map((s) => s.depth));
  const maxSample = formattedSamples.find((s) => s.depth === maxDepthInSamples);
  const maxDepthTime = maxSample?.time || 0;

  // Añadir punto con diveMaxDepth si no está incluido
  const isMaxIncluded = formattedSamples.some(
    (s) => Math.abs(s.depth - diveMaxDepth) < 0.01
  );

  if (diveMaxDepth && !isMaxIncluded) {
    const newTime =
      diveMaxDepth <= maxDepthInSamples
        ? Math.max(0, maxDepthTime - 1)
        : maxDepthTime + 1;

    formattedSamples.push({
      time: newTime,
      depth: diveMaxDepth,
      fake: true,
    });

    formattedSamples.sort((a, b) => a.time - b.time);
  }

  // Añadir 0 al inicio
  if (formattedSamples.length > 0 && formattedSamples[0].depth !== 0) {
    formattedSamples.unshift({ time: 0, depth: 0 });
  }

  // Añadir 0 al final
  // Evitar añadir un punto en tiempo duplicado
if (formattedSamples.length > 1 && formattedSamples.at(-1).depth !== 0) {
  const lastTime = formattedSamples.at(-1).time;
  const newTime = lastTime + 1;

  // Evitar duplicados:
  if (!formattedSamples.some(sample => sample.time === newTime)) {
    formattedSamples.push({
      time: newTime,
      depth: 0,
    });
  }
}
const ticks = Array.from(new Set(formattedSamples.map(s => s.time)));

  if (formattedSamples.length === 0) {
    return (
      <Modal isOpen={isOpen} onRequestClose={onClose} className={modalClass} overlayClassName={overlayClass}>
        <h2 className="text-xl font-bold mb-4">{t("dive.diveChartTitle")}</h2>
        <p>{t("dive.noValidSamples")}</p>
        <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {t("close")}
        </button>
      </Modal>
    );
  }

  const safeMaxDepth = Math.max(...formattedSamples.map((s) => s.depth));
  const yMax = Math.ceil(safeMaxDepth + 1);

  const renderCustomDot = ({ cx, cy, payload, index }) => {
    if (
      Math.abs(payload.depth - diveMaxDepth) < 0.01 ||
      payload.fake // marcar aunque haya duplicados
    ) {
      return (
        <React.Fragment key={`dot-${index}`}>
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
        </React.Fragment>
      );
    }
    return null;
  };
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className={modalClass} overlayClassName={overlayClass}>
      <h2 className="text-xl font-bold mb-4">{t("dive.diveChartTitle")}</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedSamples}>
          <XAxis
            dataKey="time"
            type="number"
            domain={["dataMin", "dataMax"]}
            ticks={ticks}
            label={{ value: t("dive.time") + " (s)", position: "insideBottom", offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, yMax]}
            reversed={true}
            label={{ value: t("dive.depth") + " (m)", angle: -90, position: "insideLeft" }}
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
        <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">
          {t("close")}
        </button>
      </div>
    </Modal>
  );
}
