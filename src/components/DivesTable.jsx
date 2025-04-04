import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDuration } from "../utils/time";

export default function DivesTable({
    dives,
    sortColumn,
    sortDirection,
    handleSort,
    handleDelete,
    selectedDives,
    setSelectedDives,
}) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const sortedDives = [...dives].sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (sortColumn === "StartTime") {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (sortColumn === "Duration" || sortColumn === "MaxDepth") {
            valA = Number(valA);
            valB = Number(valB);
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const toggleAll = (checked) => {
        if (checked) {
            setSelectedDives(dives.map((d) => d.id));
        } else {
            setSelectedDives([]);
        }
    };

    const toggleOne = (diveId, checked) => {
        if (checked) {
            setSelectedDives((prev) => [...prev, diveId]);
        } else {
            setSelectedDives((prev) => prev.filter((id) => id !== diveId));
        }
    };

    return (
        <table className="min-w-full border divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                    <th className="px-4 py-2">
                        <input
                            type="checkbox"
                            onChange={(e) => toggleAll(e.target.checked)}
                            checked={selectedDives.length === dives.length && dives.length > 0}
                        />
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("StartTime")}>
                        📅 {t("dive.details.startTime")}{" "}
                        {sortColumn === "StartTime" && (sortDirection === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("MaxDepth")}>
                        🌊 {t("dive.details.maxDepth")}{" "}
                        {sortColumn === "MaxDepth" && (sortDirection === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("Duration")}>
                        🕒 {t("dive.details.duration")}{" "}
                        {sortColumn === "Duration" && (sortDirection === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="px-4 py-2">{t("actions")}</th>
                </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
                {sortedDives.map((dive) => (
                    <tr key={dive.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                            <input
                                type="checkbox"
                                checked={selectedDives.includes(dive.id)}
                                onChange={(e) => toggleOne(dive.id, e.target.checked)}
                            />
                        </td>
                        <td className="px-4 py-2">
                            {new Date(dive.StartTime).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{dive.MaxDepth} m</td>
                        <td className="px-4 py-2">{formatDuration(dive.Duration)}</td>
                        <td className="px-4 py-2 space-x-2">
                            <button
                                onClick={() => navigate(`/dashboard/dives/${dive.id}`)}
                                className="text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                            >
                                🔍 {t("dive.view")}
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/dives/edit/${dive.id}`)}
                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                ✏️ {t("dive.edit")}
                            </button>
                            <button
                                onClick={() => handleDelete(dive.id)}
                                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                ❌ {t("dive.delete")}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
