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
