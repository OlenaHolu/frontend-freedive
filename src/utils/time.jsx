export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const mmssToSeconds = (value) => {
  if (!value) return 0;
  const [mins = 0, secs = 0] = value.split(":").map(Number);
  return (mins * 60) + (secs || 0);
};

export const formatTime = (seconds) => {
  const total = Math.round(seconds);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
};

export const formatMinutesOnly = (seconds) => Math.floor(seconds / 60);

export function formatMinutesToDaysHoursMinutesSeconds(totalMinutes, t) {
  const totalSeconds = Math.round(totalMinutes * 60);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days) parts.push(`${days}${t("stats.time.days")} `);
  if (hours) parts.push(`${hours}${t("stats.time.hours")} `);
  if (minutes) parts.push(`${minutes}${t("stats.time.minutes")} `);
  if (seconds || parts.length === 0) parts.push(`${seconds}${t("stats.time.seconds")}`);
  
  return parts.join(" ");
}