import { useEffect } from "react";

import { useDashboardStore }
  from "@/store/dashboardStore";

export function useDashboard() {

  const {
    summary,
    news,
    loading,
    fetchDashboardData,
  } = useDashboardStore();

  useEffect(() => {

    fetchDashboardData();

    const interval =
      setInterval(() => {

        fetchDashboardData();

      }, 30000);

    return () =>
      clearInterval(interval);

  }, []);

  return {
    summary,
    news,
    loading,
  };
}