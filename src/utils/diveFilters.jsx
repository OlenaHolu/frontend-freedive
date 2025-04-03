export const filterByPeriod = (dives, period) => {
    let filtered = [...dives];
  
    if (period === "7d") {
      const date7 = new Date();
      date7.setDate(date7.getDate() - 7);
      filtered = filtered.filter(d => new Date(d.StartTime) >= date7);
    }
  
    if (period === "30d") {
      const date30 = new Date();
      date30.setDate(date30.getDate() - 30);
      filtered = filtered.filter(d => new Date(d.StartTime) >= date30);
    }
    return filtered;
  };
  
  export const filterBySearch = (dives, query, formatDuration) => {
    if (!query.trim()) return dives;
  
    const q = query.toLowerCase();
  
    return dives.filter(dive =>
      dive.MaxDepth.toString().includes(q) ||
      formatDuration(dive.Duration).toLowerCase().includes(q) ||
      new Date(dive.StartTime).toLocaleDateString().toLowerCase().includes(q)
    );
  };
  