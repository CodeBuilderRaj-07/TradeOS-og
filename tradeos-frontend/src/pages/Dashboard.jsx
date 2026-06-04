import { useNavigate } from "react-router-dom"
import { Wallet, Zap, Target, Activity, RefreshCw } from "lucide-react"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/animations/stagger"
import MetricCard from "@/components/dashboard/MetricCard"
import EquityCurve from "@/components/dashboard/EquityCurve"
import RecentTrades from "@/components/dashboard/RecentTrades"
import TradeOSScore from "@/components/dashboard/TradeOSScore"
import TradeInsights from "@/components/dashboard/TradeInsights"
import MarketChart from "@/components/dashboard/MarketChart"
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton"
import { useDashboard } from "@/hooks/useDashboard"

export default function Dashboard() {
  const navigate = useNavigate()
  const { summary, loading, error, fetchDashboard } = useDashboard()

  const scoreBreakdown = useMemo(() => ({
    winRate: summary?.winRate ?? 0,
    profitFactor: Math.min(25, (summary?.profitFactor ?? 0) * 8),
    avgRMultiple: Math.min(15, (summary?.avgRMultiple ?? 0) * 3),
    totalTrades: Math.min(15, (summary?.totalTrades ?? 0) * 0.15),
    streak: Math.min(10, (summary?.bestWinStreak ?? 0) * 2),
    balance: (summary?.winningTrades ?? 0) + (summary?.losingTrades ?? 0) > 0
      ? ((summary?.winningTrades ?? 0) / ((summary?.winningTrades ?? 0) + (summary?.losingTrades ?? 0))) * 5
      : 0,
  }), [summary])

  if (loading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <GlassPanel className="p-14 text-center">
          <h2 className="text-xl font-bold text-foreground">Failed to load dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </GlassPanel>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1600px] mx-auto"
    >
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {summary?.accountName || "Set up your first trading account"}
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} />
        </button>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          title="Balance"
          value={`$${(summary?.balance || 0).toLocaleString()}`}
          icon={Wallet}
          onClick={() => navigate("/settings")}
          delay={0}
        />
        <MetricCard
          title="Today P&L"
          value={`${summary?.todayPnl >= 0 ? "+" : ""}$${(summary?.todayPnl ?? 0).toFixed(2)}`}
          icon={Zap}
          trend={summary?.todayPnl > 0 ? "up" : summary?.todayPnl < 0 ? "down" : undefined}
          onClick={() => navigate("/journal")}
          delay={0.05}
        />
        <MetricCard
          title="Win Rate"
          value={`${(summary?.winRate ?? 0).toFixed(1)}%`}
          icon={Target}
          onClick={() => navigate("/journal")}
          delay={0.1}
        />
        <MetricCard
          title="Open Trades"
          value={summary?.openTrades ?? 0}
          icon={Activity}
          onClick={() => navigate("/trades/open")}
          delay={0.15}
        />
      </motion.div>

      {/* Live Market Chart */}
      <MarketChart />

      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div variants={staggerItem} className="lg:col-span-2 space-y-4 md:space-y-6">
          <EquityCurve
            trades={(summary?.trades) || []}
            initialBalance={summary?.initialBalance || 0}
          />
          <RecentTrades trades={(summary?.trades) || []} />
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-4 md:space-y-6">
          {/* TradeOS Score */}
          <TradeOSScore
            score={summary?.tradeosScore || 0}
            breakdown={scoreBreakdown}
          />

          {/* Key Insights */}
          <TradeInsights
            profitFactor={summary?.profitFactor}
            avgRMultiple={summary?.avgRMultiple}
            avgRiskReward={summary?.avgRiskReward}
            bestWinStreak={summary?.bestWinStreak}
            currentWinStreak={summary?.currentWinStreak}
            currentLossStreak={summary?.currentLossStreak}
            grossProfit={summary?.grossProfit}
            grossLoss={summary?.grossLoss}
            avgWin={summary?.avgWin}
            avgLoss={summary?.avgLoss}
            bestDay={summary?.bestDay}
            bestDayPnl={summary?.bestDayPnl}
            worstDay={summary?.worstDay}
            worstDayPnl={summary?.worstDayPnl}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
