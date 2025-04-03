import { useState, useEffect, useCallback, useMemo } from "react";
import { getDives } from "../api/dive";
import { filterByPeriod, filterBySearch } from "../utils/diveFilters";
import { formatDuration } from "../utils/time";

export default function useDives(user, period, searchQuery, currentPage, divesPerPage = 10) {
  const [allDives, setAllDives] = useState([]);
  const [loadingDives, setLoadingDives] = useState(true);

  const filteredDives = useMemo(() => {
    let filtered = [...allDives];

    filtered = filterByPeriod(filtered, period);
    filtered = filterBySearch(filtered, searchQuery, formatDuration);

    return filtered;
  }, [allDives, period, searchQuery]);

  const dives = useMemo(() => {
    if (period === "all" && searchQuery.trim() === "") {
      const startIndex = (currentPage - 1) * divesPerPage;
      return filteredDives.slice(startIndex, startIndex + divesPerPage);
    }
    return filteredDives;
  }, [filteredDives, period, searchQuery, currentPage, divesPerPage]);

  const totalPages = useMemo(() => {
    if (period === "all" && searchQuery.trim() === "") {
      return Math.ceil(filteredDives.length / divesPerPage);
    }
    return 1;
  }, [filteredDives.length, period, searchQuery, divesPerPage]);

  const fetchDives = useCallback(async () => {
    if (!user) return;
    setLoadingDives(true);
    try {
      const res = await getDives();
      const sorted = res.dives.sort((a, b) => new Date(b.StartTime) - new Date(a.StartTime));
      setAllDives(sorted);
    } catch (err) {
      console.error("Error fetching dives:", err);
    } finally {
      setLoadingDives(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDives();
  }, [fetchDives]);

  return {
    dives,
    loadingDives,
    totalPages,
    refetch: fetchDives,
  };
}
