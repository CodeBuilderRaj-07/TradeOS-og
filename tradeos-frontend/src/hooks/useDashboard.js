import { useQuery } from "@tanstack/react-query"
import API from "@/services/api"

async function fetchDashboardData() {
  const [summaryRes, tradesRes] = await Promise.allSettled([
    API.get("/dashboard/summary"),
    API.get("/trades?limit=100"),
  ])

  const summaryData = summaryRes.status === "fulfilled" ? summaryRes.value.data : {}
  const trades = tradesRes.status === "fulfilled" ? tradesRes.value.data || [] : []

  const closed = trades.filter((t) => t.status !== "open")
  const winners = closed.filter((t) => (t.pnl || 0) > 0)
  const today = new Date().toDateString()
  const todayPnl = closed
    .filter((t) =>
      new Date(t.updatedAt || t.createdAt).toDateString() === today
    )
    .reduce((sum, t) => sum + (t.pnl || 0), 0)
  const winRate = closed.length > 0 ? (winners.length / closed.length) * 100 : 0

  return {
    summary: {
      totalPnl: summaryData?.totalPnl || 0,
      totalTrades: summaryData?.totalTrades || 0,
      winningTrades: summaryData?.winningTrades || 0,
      losingTrades: summaryData?.losingTrades || 0,
      breakevenTrades: summaryData?.breakevenTrades || 0,
      winRate,
      openTrades: summaryData?.openTrades || 0,
      balance: summaryData?.balance || 0,
      todayPnl,
      trades,
      initialBalance: summaryData?.initialBalance || 0,
      accountName: summaryData?.accountName || "",
      profitFactor: summaryData?.profitFactor || 0,
      avgRMultiple: summaryData?.avgRMultiple || 0,
      avgRiskReward: summaryData?.avgRiskReward || 0,
      bestWinStreak: summaryData?.bestWinStreak || 0,
      currentWinStreak: summaryData?.currentWinStreak || 0,
      currentLossStreak: summaryData?.currentLossStreak || 0,
      grossProfit: summaryData?.grossProfit || 0,
      grossLoss: summaryData?.grossLoss || 0,
      avgWin: summaryData?.avgWin || 0,
      avgLoss: summaryData?.avgLoss || 0,
      bestDay: summaryData?.bestDay || "",
      bestDayPnl: summaryData?.bestDayPnl || 0,
      worstDay: summaryData?.worstDay || "",
      worstDayPnl: summaryData?.worstDayPnl || 0,
      tradeosScore: summaryData?.tradeosScore || 0,
    },
  }
}

export function useDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
    meta: { errorMessage: "Failed to load dashboard" },
  })

  return {
    summary: data?.summary || {},
    loading: isLoading,
    error: error ? (error.message || "Failed to load dashboard") : null,
    fetchDashboard: refetch,
  }
}
