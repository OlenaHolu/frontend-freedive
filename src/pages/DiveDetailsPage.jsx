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
import { ArrowLeft, Waves, Clock, Thermometer, TrendingDown } from "lucide-react";

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

  if (loading) return <div className="p-6 text-gray-500 text-center animate-pulse">{t("loading")}...</div>;
  if (!dive) return <div className="p-6 text-red-600 text-center">{t("error")}</div>;

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
    if (Math.abs(payload.depth - dive.MaxDepth) < 0.01 || payload.fake) {
      return (
        <g key={`dot-${index}`}>
          <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#b91c1c" strokeWidth={2} />
          <text x={cx + 10} y={cy - 10} fontSize={12} fill="#b91c1c" fontWeight="bold">
            {t("dive.maxDepthLabel")} {payload.depth} m
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft className="mr-1" /> {t("back")}
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-800">{t("dive.diveDetails")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p className="flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500" /> <strong>{t("dive.startTime")}:</strong>&nbsp;{new Date(dive.StartTime).toLocaleString()}</p>
          <p className="flex items-center"><Waves className="w-5 h-5 mr-2 text-blue-500" /> <strong>{t("dive.maxDepth")}:</strong>&nbsp;{dive.MaxDepth} m</p>
          <p className="flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-500" /> <strong>{t("dive.duration")}:</strong>&nbsp;{formatDuration(dive.Duration)} min</p>
          <p className="flex items-center"><Thermometer className="w-5 h-5 mr-2 text-blue-500" /> <strong>{t("dive.temp")}:</strong>&nbsp;{dive.StartTemperature}° ➝ {dive.BottomTemperature}° ➝ {dive.EndTemperature}°</p>
          <p className="flex items-center"><TrendingDown className="w-5 h-5 mr-2 text-blue-500" /> <strong>{t("dive.previousMax")}:</strong>&nbsp;{dive.PreviousMaxDepth} m</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">{t("dive.diveChartTitle")}</h3>

          {formattedSamples.length === 0 ? (
            <p className="text-gray-500">{t("dive.noValidSamples")}</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
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
          )}
        </div>
      </div>
    </div>
  );
}
