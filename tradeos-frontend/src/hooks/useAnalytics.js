import { useEffect }
  from "react";

import {
  useAnalyticsStore,
} from "@/store/analyticsStore";

export function useAnalytics() {

  const {
    summary,
    monthlyPnl,
    streaks,
    riskReward,
    drawdown,
    loading,
    fetchAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const pieData = [
    {
      name: "Winning",
      value:
        summary.winningTrades || 0,
    },
    {
      name: "Losing",
      value:
        (
          summary.totalTrades || 0
        ) -
        (
          summary.winningTrades || 0
        ),
    },
  ];

  return {
    summary,
    monthlyPnl,
    streaks,
    riskReward,
    drawdown,
    pieData,
    loading,
  };
}