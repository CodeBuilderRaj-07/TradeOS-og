import {
  useEffect,
  useState,
} from "react";

import API
  from "@/services/api";

import {
  errorToast,
} from "@/services/toastService";

export function useDashboard() {

  const [loading,
    setLoading] =
    useState(true);

  const [summary,
    setSummary] =
    useState({

      totalPnl: 0,

      totalTrades: 0,

      winRate: 0,

      openTrades: 0,
    });

  const [news,
    setNews] =
    useState([]);

  /* Fetch Dashboard */
  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        const response =
          await API.get(
            "/dashboard/summary"
          );

        setSummary({

          totalPnl:
            response.data
              ?.totalPnl || 0,

          totalTrades:
            response.data
              ?.totalTrades || 0,

          winRate:
            response.data
              ?.winRate || 0,

          openTrades:
            response.data
              ?.openTrades || 0,
        });

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchDashboard();

  }, []);

  return {

    summary,
    news,

    loading,

    fetchDashboard,
  };
}