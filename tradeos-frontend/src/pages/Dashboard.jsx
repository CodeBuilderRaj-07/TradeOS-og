import { motion } from "framer-motion";

import DashboardHeader from "@/components/dashboard/DashboardHeader";

import MetricCard from "@/components/dashboard/MetricCard";

import MarketChartCard
  from "@/components/dashboard/MarketChartCard";

import DisciplineCard
  from "@/components/dashboard/DisciplineCard";

import StreakCard
  from "@/components/dashboard/StreakCard";

import AiInsightCard
  from "@/components/dashboard/AiInsightCard";

import NewsCard
  from "@/components/dashboard/NewsCard";

import DashboardSkeleton
  from "@/components/skeletons/DashboardSkeleton";

import {
  DollarSign,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";

import {
  useDashboard,
} from "@/hooks/useDashboard";

import {
  pageTransition,
} from "@/animations/page";

import {
  staggerContainer,
  staggerItem,
} from "@/animations/stagger";

export default function Dashboard() {

  const {
    summary,
    news,
    loading,
  } = useDashboard();

  if (loading) {

    return <DashboardSkeleton />;
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

        <DashboardHeader />

      </motion.div>

      {/* Metrics */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >

        <MetricCard
          title="TOTAL PNL"
          value={`$${summary.totalPnl}`}
          change="+12.8% this week"
          icon={DollarSign}
        />

        <MetricCard
          title="TOTAL TRADES"
          value={summary.totalTrades}
          change="Trading Analytics"
          icon={TrendingUp}
        />

        <MetricCard
          title="WIN RATE"
          value={`${summary.winRate}%`}
          change="Performance Growth"
          icon={Target}
        />

        <MetricCard
          title="OPEN TRADES"
          value={summary.openTrades}
          change="Currently Active"
          icon={Activity}
        />

      </motion.section>

      {/* Main Grid */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        transition={{
          delayChildren: 0.15,
        }}

        className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]"
      >

        {/* Chart */}
        <motion.div
          variants={staggerItem}
        >

          <MarketChartCard />

        </motion.div>

        {/* Right Side */}
        <motion.div

          variants={staggerContainer}

          className="space-y-4"
        >

          <motion.div
            variants={staggerItem}
          >

            <DisciplineCard />

          </motion.div>

          <motion.div
            variants={staggerItem}
          >

            <StreakCard />

          </motion.div>

          <motion.div
            variants={staggerItem}
          >

            <AiInsightCard />

          </motion.div>

          <motion.div
            variants={staggerItem}
          >

            <NewsCard news={news} />

          </motion.div>

        </motion.div>

      </motion.section>

    </motion.div>
  );
}