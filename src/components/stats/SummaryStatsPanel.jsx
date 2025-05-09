import { formatMinutesToDaysHoursMinutesSeconds } from "../../utils/time";

const SummaryStatsPanel = ({ totalDive, totalSurface, t }) => {
    const total = totalDive + totalSurface;
    const ratio = totalDive > 0 ? (totalSurface / totalDive).toFixed(2) : "–";

    return (
        <div title={t("stats.timeSpentUnderwater")} className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
                <div className="text-xs text-gray-500">{t("stats.underwater")}</div>
                <div className="text-sm font-semibold">
                    {formatMinutesToDaysHoursMinutesSeconds(totalDive, t)}
                </div>
            </div>
            <div title={t("stats.surfaceRecoveryTime")} className="bg-orange-100 p-4 rounded-lg shadow text-center">
                <div className="text-xs text-gray-500">{t("stats.surface")}</div>
                <div className="text-sm font-semibold">
                    {formatMinutesToDaysHoursMinutesSeconds(totalSurface, t)}
                </div>
            </div>
            <div title={t("stats.totalTimeExplanation")} className="bg-gray-100 p-4 rounded-lg shadow text-center">
                <div className="text-xs text-gray-500">{t("stats.total")}</div>
                <div className="text-sm font-semibold">
                    {formatMinutesToDaysHoursMinutesSeconds(total, t)}
                </div>
            </div>
            <div title={t("stats.recoveryRatioTooltip")} className="bg-green-100 p-4 rounded-lg shadow text-center">
                <div className="text-xs text-gray-500">{t("stats.recoveryRatio")}</div>
                <div className="text-sm font-semibold">{ratio} : 1</div>
            </div>
        </div>
    );
};

export default SummaryStatsPanel;
