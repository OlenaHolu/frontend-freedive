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
  