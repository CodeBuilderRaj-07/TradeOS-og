import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";

async function fetchAnalyticsData() {
  const [
    dashboardRes,
    monthlyRes,
    streakRes,
    rrRes,
    drawdownRes,
    symbolRes,
  ] = await Promise.all([
    API.get("/dashboard/summary"),
    API.get("/analytics/monthly-pnl"),
    API.get("/analytics/streaks"),
    API.get("/analytics/risk-reward"),
    API.get("/analytics/drawdown"),
    API.get("/analytics/by-symbol"),
  ]);

  const summaryData = dashboardRes.data || {};

  const monthlyPnl = Object.entries(
    monthlyRes.data || {}
  ).map(
    ([month, pnl]) => ({ month, pnl })
  );

  const bySymbol = Object.entries(
    symbolRes.data || {}
  ).map(
    ([symbol, data]) => ({
      symbol,
      pnl: data.totalPnl || 0,
      trades: data.totalTrades || 0,
      wins: data.wins || 0,
      losses: data.losses || 0,
      winRate: data.winRate || 0,
    })
  ).sort((a, b) => b.pnl - a.pnl);

  const streaks = streakRes.data || {};
  const riskReward = rrRes.data || {};
  const drawdown = drawdownRes.data || {};

  const wins = summaryData.winningTrades || 0;
  const losses = (summaryData.closedTrades || 0) - wins;

  const pieData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: Math.max(0, losses) },
  ];

  return {
    summary: summaryData,
    monthlyPnl,
    streaks,
    riskReward,
    drawdown,
    pieData,
    bySymbol,
  };
}

export function useAnalytics() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsData,
    staleTime: 30000,
    meta: { errorMessage: "Failed to load analytics" },
  });

  return {
    summary: data?.summary || {},
    monthlyPnl: data?.monthlyPnl || [],
    streaks: data?.streaks || {},
    riskReward: data?.riskReward || {},
    drawdown: data?.drawdown || {},
    pieData: data?.pieData || [],
    bySymbol: data?.bySymbol || [],
    loading: isLoading,
    fetchAnalytics: refetch,
  };
}
