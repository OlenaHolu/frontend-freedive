import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDiveById } from "../api/dive";
import { formatDuration } from "../utils/time";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DiveDetailsPage() {
  const { diveId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dive, setDive] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDive = async () => {
      try {
        const res = await getDiveById(diveId);
        setDive(res.dive);
        setSamples(res.dive.samples);
      } catch (err) {
        console.error("Error loading dive:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDive();
  }, [diveId]);

  if (loading) return <div className="p-4 text-gray-600">{t("loading")}</div>;
  if (!dive) return <div className="p-4 text-red-600">{t("error")}</div>;

  // Reuse sample formatting logic (copied from DiveChartModal)
  let formattedSamples = samples
    .map((s) => {
      const time = Number(s.time);
      const depth = Number(s.depth);
      if (!isFinite(time) || !isFinite(depth) || depth < 0 || depth > 200) return null;
      return { time, depth: parseFloat(depth.toFixed(2)) };
    })
    .filter(Boolean)
    .sort((a, b) => a.time - b.time);

  const maxDepthInSamples = Math.max(...formattedSamples.map((s) => s.depth));
  const maxSample = formattedSamples.find((s) => s.depth === maxDepthInSamples);
  const maxDepthTime = maxSample?.time || 0;

  const isMaxIncluded = formattedSamples.some(
    (s) => Math.abs(s.depth - dive.MaxDepth) < 0.01
  );

  if (dive.MaxDepth && !isMaxIncluded) {
    const newTime =
      dive.MaxDepth <= maxDepthInSamples
        ? Math.max(0, maxDepthTime - 1)
        : maxDepthTime + 1;
    formattedSamples.push({
      time: newTime,
      depth: dive.MaxDepth,
      fake: true,
    });
    formattedSamples.sort((a, b) => a.time - b.time);
  }

  if (formattedSamples.length > 0 && formattedSamples[0].depth !== 0) {
    formattedSamples.unshift({ time: 0, depth: 0 });
  }

  if (formattedSamples.length > 1 && formattedSamples.at(-1).depth !== 0) {
    const lastTime = formattedSamples.at(-1).time;
    const newTime = lastTime + 1;
    if (!formattedSamples.some(sample => sample.time === newTime)) {
      formattedSamples.push({ time: newTime, depth: 0 });
    }
  }

  const yMax = Math.ceil(Math.max(...formattedSamples.map(s => s.depth)) + 1);
  const ticks = Array.from(new Set(formattedSamples.map(s => s.time)));

  const renderCustomDot = ({ cx, cy, payload, index }) => {
    if (
      Math.abs(payload.depth - dive.MaxDepth) < 0.01 ||
      payload.fake
    ) {
      return (
        <React.Fragment key={`dot-${index}`}>
          <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#b91c1c" strokeWidth={2} />
          <text x={cx + 10} y={cy - 10} fontSize={12} fill="#b91c1c" fontWeight="bold">
            {t("dive.maxDepthLabel")} {payload.depth} m
          </text>
        </React.Fragment>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          ← {t("back")}
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">{t("dive.diveDetails")}</h2>

      <div className="grid gap-2 mb-6">
        <p><strong>{t("dive.startTime")}:</strong> {new Date(dive.StartTime).toLocaleString()}</p>
        <p><strong>{t("dive.maxDepth")}:</strong> {dive.MaxDepth} m</p>
        <p><strong>{t("dive.duration")}:</strong> {formatDuration(dive.Duration)} min</p>
        <p><strong>{t("dive.temp")}:</strong> {dive.StartTemperature}° ➝ {dive.BottomTemperature}° ➝ {dive.EndTemperature}°</p>
        <p><strong>{t("dive.previousMax")}:</strong> {dive.PreviousMaxDepth} m</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">{t("dive.diveChartTitle")}</h3>

      {formattedSamples.length === 0 ? (
        <p>{t("dive.noValidSamples")}</p>
      ) : (
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
            <Tooltip formatter={(value, name) => name === "depth" ? [`${value} m`, t("dive.depth")] : value} />
            <Line
              type="monotone"
              dataKey="depth"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={renderCustomDot}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
