import {
  useEffect,
  useState,
} from "react";

import API
  from "@/services/api";

import {
  errorToast,
} from "@/services/toastService";

export function useAnalytics() {

  const [loading,
    setLoading] =
    useState(true);

  const [summary,
    setSummary] =
    useState({});

  const [monthlyPnl,
    setMonthlyPnl] =
    useState([]);

  const [streaks,
    setStreaks] =
    useState({});

  const [riskReward,
    setRiskReward] =
    useState({});

  const [drawdown,
    setDrawdown] =
    useState({});

  const [pieData,
    setPieData] =
    useState([]);

  /* Fetch Analytics */
  const fetchAnalytics =
    async () => {

      try {

        setLoading(true);

        const [

          dashboardRes,
          monthlyRes,
          streakRes,
          rrRes,
          drawdownRes,

        ] = await Promise.all([

          API.get(
            "/dashboard/summary"
          ),

          API.get(
            "/analytics/monthly-pnl"
          ),

          API.get(
            "/analytics/streaks"
          ),

          API.get(
            "/analytics/risk-reward"
          ),

          API.get(
            "/analytics/drawdown"
          ),
        ]);

        /* Summary */
        setSummary(
          dashboardRes.data || {}
        );

        /* Monthly Chart */
        const monthlyData =
          Object.entries(
            monthlyRes.data || {}
          ).map(
            ([month, pnl]) => ({
              month,
              pnl,
            })
          );

        setMonthlyPnl(
          monthlyData
        );

        /* Streaks */
        setStreaks(
          streakRes.data || {}
        );

        /* RR */
        setRiskReward(
          rrRes.data || {}
        );

        /* Drawdown */
        setDrawdown(
          drawdownRes.data || {}
        );

        /* Pie Chart */
        setPieData([
          {
            name: "Wins",
            value:
              summary.winningTrades || 0,
          },
          {
            name: "Losses",
            value:
              summary.closedTrades -

                summary.winningTrades || 0,
          },
        ]);

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to load analytics"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchAnalytics();

  }, []);

  return {

    summary,

    monthlyPnl,

    streaks,

    riskReward,

    drawdown,

    pieData,

    loading,

    fetchAnalytics,
  };
}