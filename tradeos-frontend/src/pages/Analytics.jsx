import React from "react";

import { motion } from "framer-motion";

import AnalyticsHeader
  from "@/components/analytics/AnalyticsHeader";

import AnalyticsMetricCard
  from "@/components/analytics/AnalyticsMetricCard";

import MonthlyPerformanceChart
  from "@/components/analytics/MonthlyPerformanceChart";

import WinRatioChart
  from "@/components/analytics/WinRatioChart";

import DrawdownCard
  from "@/components/analytics/DrawdownCard";

import StreakAnalyticsCard
  from "@/components/analytics/StreakAnalyticsCard";

import AiAnalyticsCard
  from "@/components/analytics/AiAnalyticsCard";

import AccountStatCard
  from "@/components/analytics/AccountStatCard";

import AnalyticsSkeleton
  from "@/components/skeletons/AnalyticsSkeleton";

import GlassPanel
  from "@/components/ui/GlassPanel";

import {
  TrendingUp,
  Target,
  ShieldCheck,
  Activity,
} from "lucide-react";

import {
  useAnalytics,
} from "@/hooks/useAnalytics";

import {
  pageTransition,
} from "@/animations/page";

import {
  staggerContainer,
  staggerItem,
} from "@/animations/stagger";

function Analytics() {

  const {
    summary,
    monthlyPnl,
    streaks,
    riskReward,
    drawdown,
    pieData,
    loading,
  } = useAnalytics();

  /* Loading */
  if (loading) {

    return (
      <AnalyticsSkeleton />
    );
  }

  return (

    <motion.div

      variants={pageTransition}

      initial="initial"

      animate="animate"

      exit="exit"

      className="space-y-6"
    >

      {/* Header */}
      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="show"
      >

        <AnalyticsHeader />

      </motion.div>

      {/* Metrics */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >

        <AnalyticsMetricCard
          title="TOTAL PNL"
          value={`$${(
            summary.totalPnl || 0
          ).toFixed(2)}`}
          icon={TrendingUp}
          success
        />

        <AnalyticsMetricCard
          title="WIN RATE"
          value={`${(
            summary.winRate || 0
          ).toFixed(1)}%`}
          icon={Target}
        />

        <AnalyticsMetricCard
          title="BEST STREAK"
          value={
            streaks.bestWinStreak || 0
          }
          icon={ShieldCheck}
        />

        <AnalyticsMetricCard
          title="AVG R:R"
          value={`1 : ${(
            riskReward.averageRiskReward || 0
          ).toFixed(2)}`}
          icon={Activity}
        />

      </motion.section>

      {/* Charts */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        transition={{
          delayChildren: 0.1,
        }}

        className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.8fr]"
      >

        <motion.div
          variants={staggerItem}
        >

          <MonthlyPerformanceChart
            data={monthlyPnl}
          />

        </motion.div>

        <motion.div
          variants={staggerItem}
        >

          <WinRatioChart
            pieData={pieData}
          />

        </motion.div>

      </motion.section>

      {/* Analytics Cards */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        transition={{
          delayChildren: 0.15,
        }}

        className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]"
      >

        <motion.div
          variants={staggerItem}
        >

          <DrawdownCard
            drawdown={drawdown}
          />

        </motion.div>

        <motion.div

          variants={staggerContainer}

          className="space-y-4"
        >

          <motion.div
            variants={staggerItem}
          >

            <StreakAnalyticsCard
              streaks={streaks}
            />

          </motion.div>

          <motion.div
            variants={staggerItem}
          >

            <AiAnalyticsCard />

          </motion.div>

        </motion.div>

      </motion.section>

      {/* Account Stats */}
      <motion.section

        variants={staggerItem}

        initial="hidden"

        animate="show"
      >

        <GlassPanel className="p-6">

          <div className="mb-6 flex items-center gap-3">

            <Activity
              size={18}
              className="text-blue-400"
            />

            <h3 className="text-lg font-bold text-white">

              Account Statistics

            </h3>

          </div>

          <motion.div

            variants={staggerContainer}

            initial="hidden"

            animate="show"

            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >

            <motion.div
              variants={staggerItem}
            >

              <AccountStatCard
                title="Winning Trades"
                value={
                  summary.winningTrades || 0
                }
                description="Successful trades"
              />

            </motion.div>

            <motion.div
              variants={staggerItem}
            >

              <AccountStatCard
                title="Closed Trades"
                value={
                  summary.closedTrades || 0
                }
                description="Completed positions"
              />

            </motion.div>

            <motion.div
              variants={staggerItem}
            >

              <AccountStatCard
                title="Open Trades"
                value={
                  summary.openTrades || 0
                }
                description="Currently active"
              />

            </motion.div>

          </motion.div>

        </GlassPanel>

      </motion.section>

    </motion.div>
  );
}

export default React.memo(
  Analytics
);