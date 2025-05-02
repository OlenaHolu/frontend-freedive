import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDiveById } from "../api/dive";
import { formatDuration } from "../utils/time";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Waves,
  Clock,
  Thermometer,
  TrendingDown,
  Compass,
  Settings,
  Cpu,
  BatteryFull,
  FileText,
  CloudSun,
  Eye,
  ListOrdered,
  Weight
} from "lucide-react";


export default function DiveDetailsPage() {
  const { diveId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dive, setDive] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

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

  if (loading) return <div className="p-6 text-center text-gray-500">{t("loading")}...</div>;
  if (!dive) return <div className="p-6 text-center text-red-600">{t("loadingError")}</div>;

  // Chart data formatting
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
    const newTime = dive.MaxDepth <= maxDepthInSamples
      ? Math.max(0, maxDepthTime - 1)
      : maxDepthTime + 1;
    formattedSamples.push({ time: newTime, depth: dive.MaxDepth, fake: true });
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

  const tabs = [
    { key: "general", label: t("dive.details.general") },
    { key: "temperatures", label: t("dive.details.temperatures") },
    { key: "environment", label: t("dive.details.environment") },
    { key: "device", label: t("dive.details.device") },
  ];

  if (dive.Note) {
    tabs.push({ key: "note", label: t("diveDetails.note") });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("back")}</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-800">{t("dive.details.title")}</h2>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{t("dive.diveChartTitle")}</h3>
          {formattedSamples.length === 0 ? (
            <p className="text-gray-500">{t("dive.noValidSamples")}</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={formattedSamples}>
                <XAxis dataKey="time" type="number" domain={["dataMin", "dataMax"]} ticks={ticks}
                  label={{ value: t("dive.time") + " (s)", position: "insideBottom", offset: -5 }} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, yMax]} reversed={true}
                  label={{ value: t("dive.depth") + " (m)", angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => name === "depth" ? [`${value} m`, t("dive.depth")] : value} />
                <Line type="monotone" dataKey="depth" stroke="#0ea5e9" strokeWidth={2} dot={renderCustomDot} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Manual tabs */}
        <div className="flex flex-wrap gap-2 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t-md text-sm font-medium ${activeTab === tab.key ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-500"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "general" && (
          <TableSection>
            <InfoRow icon={<Clock size={16} />} label={t("dive.details.startTime")} value={new Date(dive.StartTime).toLocaleString()} />
            <InfoRow icon={<Clock size={16} />} label={t("dive.details.duration")} value={`${formatDuration(dive.Duration)} min`} />
            <InfoRow icon={<Waves size={16} />} label={t("dive.details.maxDepth")} value={`${dive.MaxDepth} m`} />
            <InfoRow icon={<Compass size={16} />} label={t("dive.details.avgDepth")} value={`${dive.AvgDepth ?? "—"} m`} />
            <InfoRow icon={<Clock size={16} />} label={t("dive.details.sampleInterval")} value={`${dive.SampleInterval ?? "—"} s`} />
            <InfoRow icon={<TrendingDown size={16} />} label={t("dive.details.previousMax")} value={`${dive.PreviousMaxDepth ?? "—"} m`} />
            <InfoRow icon={<Clock size={16} />} label={t("dive.details.diveTime")} value={`${dive.Duration ?? "—"} s`} />
            <InfoRow icon={<Weight size={16} />} label={t("dive.details.weight")} value={`${dive.Weight ?? "—"} kg`} />
            <InfoRow icon={<ListOrdered size={16} />} label={t("dive.details.diveNumberInSerie")} value={dive.DiveNumberInSerie ?? "—"} />
          </TableSection>
        )}


        {activeTab === "temperatures" && (
          <TableSection>
            <InfoRow icon={<Thermometer size={16} />} label={t("dive.details.startTemp")} value={`${dive.StartTemperature}°`} />
            <InfoRow icon={<Thermometer size={16} />} label={t("dive.details.bottomTemp")} value={`${dive.BottomTemperature}°`} />
            <InfoRow icon={<Thermometer size={16} />} label={t("dive.details.endTemp")} value={`${dive.EndTemperature}°`} />
          </TableSection>
        )}


        {activeTab === "environment" && (
          <TableSection>
            <InfoRow icon={<CloudSun size={16} />} label={t("dive.details.weather")} value={dive.Weather ?? "—"} />
            <InfoRow icon={<Eye size={16} />} label={t("dive.details.visibility")} value={dive.Visibility ?? "—"} />
            <InfoRow icon={<Waves size={16} />} label={t("dive.details.surfacePressure")} value={dive.SurfacePressure ?? "—"} />
            <InfoRow icon={<Clock size={16} />} label={t("dive.details.surfaceTime")} value={dive.SurfaceTime ?? "—"} />
            <InfoRow icon={<Waves size={16} />} label={t("dive.details.altitudeMode")} value={dive.AltitudeMode ?? "—"} />
          </TableSection>
        )}


        {activeTab === "device" && (
          <TableSection>
            <InfoRow icon={<FileText size={16} />} label={t("dive.details.source")} value={dive.Source || "—"} />
            <InfoRow icon={<Cpu size={16} />} label={t("dive.details.mode")} value={dive.Mode ?? "—"} />
            <InfoRow icon={<Settings size={16} />} label={t("dive.details.personalMode")} value={dive.PersonalMode ?? "—"} />
            <InfoRow icon={<Cpu size={16} />} label={t("dive.details.serial")} value={dive.SerialNumber || "—"} />
            <InfoRow icon={<BatteryFull size={16} />} label={t("dive.details.battery")} value={`${dive.Battery ?? "—"} %`} />
            <InfoRow icon={<Compass size={16} />} label={t("dive.details.ascentMode")} value={dive.AscentMode} />
            <InfoRow icon={<Waves size={16} />} label={t("dive.details.lastDecoStop")} value={`${dive.LastDecoStopDepth ?? "—"} m`} />
            <InfoRow icon={<FileText size={16} />} label={t("dive.details.software")} value={dive.Software || "—"} />
          </TableSection>
        )}

        {activeTab === "note" && dive.Note && (
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-yellow-700 mb-2">📝 {t("dive.details.note")}</h4>
            <p className="text-gray-700 whitespace-pre-wrap text-sm">{dive.Note}</p>
          </div>
        )}

      </div>
    </div>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center border-b border-gray-100 py-1.5 text-sm text-gray-700">
    <div className="w-5 h-5 text-blue-500 mr-3">{icon}</div>
    <div className="flex-1 text-gray-500">{label}</div>
    <div className="text-right font-medium text-gray-800">{value}</div>
  </div>
);

const TableSection = ({ children }) => (
  <div className="bg-blue-50 rounded-lg p-3 shadow-sm divide-y divide-gray-100">{children}</div>
);

