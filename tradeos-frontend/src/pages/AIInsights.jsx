import React from "react";

import { motion } from "framer-motion";

import AIInsightsHeader
  from "@/components/ai-insights/AIInsightsHeader";

import AIStatCard
  from "@/components/ai-insights/AIStatCard";

import InsightCard
  from "@/components/ai-insights/InsightCard";

import SuggestedImprovementCard
  from "@/components/ai-insights/SuggestedImprovementCard";

import AISummaryCard
  from "@/components/ai-insights/AISummaryCard";

import AIInsightsSkeleton
  from "@/components/skeletons/AIInsightsSkeleton";

import GlassPanel
  from "@/components/ui/GlassPanel";

import {
  Brain,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import {
  useAIInsights,
} from "@/hooks/useAIInsights";

import {
  pageTransition,
} from "@/animations/page";

import {
  staggerContainer,
  staggerItem,
} from "@/animations/stagger";

function AIInsights() {

  const {
    insights,
    loading,
  } = useAIInsights();

  /* Loading */
  if (loading) {

    return (
      <AIInsightsSkeleton />
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

        <AIInsightsHeader />

      </motion.div>

      {/* Top Stats */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >

        <AIStatCard
          title="AI CONFIDENCE"
          value="92%"
          description="High prediction accuracy"
          icon={Brain}
          green
        />

        <AIStatCard
          title="DISCIPLINE SCORE"
          value="75"
          description="Stable execution behavior"
          icon={ShieldCheck}
        />

        <AIStatCard
          title="RISK LEVEL"
          value="Medium"
          description="Monitor emotional entries"
          icon={AlertTriangle}
          warning
        />

      </motion.section>

      {/* Main Analysis */}
      <motion.section

        variants={staggerItem}

        initial="hidden"

        animate="show"
      >

        <GlassPanel className="p-6">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-white">

              AI Trading Analysis

            </h2>

            <p className="mt-1 text-sm text-zinc-500">

              Machine learning behavioral insights

            </p>

          </div>

          <motion.div

            variants={staggerContainer}

            initial="hidden"

            animate="show"

            className="space-y-4"
          >

            {insights.map(
              (
                insight,
                index
              ) => (

                <motion.div
                  key={index}
                  variants={staggerItem}
                >

                  <InsightCard
                    insight={insight}
                  />

                </motion.div>
              )
            )}

          </motion.div>

        </GlassPanel>

      </motion.section>

      {/* Bottom Grid */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        transition={{
          delayChildren: 0.1,
        }}

        className="grid grid-cols-1 gap-4 xl:grid-cols-2"
      >

        <motion.div
          variants={staggerItem}
        >

          <SuggestedImprovementCard />

        </motion.div>

        <motion.div
          variants={staggerItem}
        >

          <AISummaryCard />

        </motion.div>

      </motion.section>

    </motion.div>
  );
}

export default React.memo(
  AIInsights
);