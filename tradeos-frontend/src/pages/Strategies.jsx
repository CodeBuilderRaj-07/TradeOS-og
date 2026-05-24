import React from "react";

import { motion } from "framer-motion";

import {
  Layers3,
  TrendingUp,
  ShieldCheck,
  Brain,
  Plus,
} from "lucide-react";

import GlassPanel
  from "@/components/ui/GlassPanel";

import AnimatedButton
  from "@/components/ui/AnimatedButton";

import {
  pageTransition,
} from "@/animations/page";

import {
  staggerContainer,
  staggerItem,
} from "@/animations/stagger";

function Strategies() {

  const strategies = [

    {
      name: "Breakout Momentum",
      type: "Scalping",
      winRate: "72%",
      status: "Active",
    },

    {
      name: "Trend Following",
      type: "Swing",
      winRate: "68%",
      status: "Testing",
    },

    {
      name: "Liquidity Sweep",
      type: "Intraday",
      winRate: "81%",
      status: "Optimized",
    },
  ];

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

        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >

        <div>

          <h1 className="text-4xl font-black tracking-tight text-white">

            Strategies

          </h1>

          <p className="mt-2 text-sm text-zinc-500">

            Organize, test, and optimize your trading systems

          </p>

        </div>

        <AnimatedButton

          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.2)]"
        >

          <Plus size={18} />

          New Strategy

        </AnimatedButton>

      </motion.div>

      {/* Stats */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >

        <StatCard
          title="ACTIVE STRATEGIES"
          value="12"
          icon={Layers3}
        />

        <StatCard
          title="AVERAGE WIN RATE"
          value="74%"
          icon={TrendingUp}
          green
        />

        <StatCard
          title="AI OPTIMIZATION"
          value="Enabled"
          icon={Brain}
        />

      </motion.section>

      {/* Main Grid */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        transition={{
          delayChildren: 0.1,
        }}

        className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]"
      >

        {/* Strategies */}
        <motion.div
          variants={staggerItem}
        >

          <GlassPanel className="p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">

                  Strategy Library

                </h2>

                <p className="mt-1 text-sm text-zinc-500">

                  Professional trading systems

                </p>

              </div>

              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400">

                {strategies.length} Active

              </div>

            </div>

            <div className="space-y-4">

              {strategies.map(
                (
                  strategy,
                  index
                ) => (

                  <motion.div

                    key={index}

                    variants={staggerItem}
                  >

                    <GlassPanel className="border-white/5 p-5">

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                          <h3 className="text-lg font-bold text-white">

                            {strategy.name}

                          </h3>

                          <p className="mt-2 text-sm text-zinc-500">

                            {strategy.type} Trading Strategy

                          </p>

                        </div>

                        <div className="flex items-center gap-6">

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

                              Win Rate

                            </p>

                            <h3 className="mt-2 text-2xl font-black text-green-400">

                              {strategy.winRate}

                            </h3>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

                              Status

                            </p>

                            <div className="mt-2 rounded-2xl border border-green-500/10 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400">

                              {strategy.status}

                            </div>

                          </div>

                        </div>

                      </div>

                    </GlassPanel>

                  </motion.div>
                )
              )}

            </div>

          </GlassPanel>

        </motion.div>

        {/* Right Side */}
        <motion.div

          variants={staggerContainer}

          className="space-y-4"
        >

          {/* AI Analysis */}
          <motion.div
            variants={staggerItem}
          >

            <GlassPanel className="p-6">

              <div className="flex items-center gap-3">

                <Brain
                  size={18}
                  className="text-blue-400"
                />

                <h3 className="text-lg font-bold text-white">

                  AI Strategy Coach

                </h3>

              </div>

              <div className="mt-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-5">

                <p className="text-sm leading-7 text-zinc-300">

                  Your breakout momentum strategy shows strong consistency during high volatility sessions.

                </p>

              </div>

            </GlassPanel>

          </motion.div>

          {/* Optimization */}
          <motion.div
            variants={staggerItem}
          >

            <GlassPanel className="p-6">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  size={18}
                  className="text-green-400"
                />

                <h3 className="text-lg font-bold text-white">

                  Optimization Status

                </h3>

              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-green-400">

                92%

              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-500">

                Strategy optimization confidence powered by AI analytics.

              </p>

            </GlassPanel>

          </motion.div>

        </motion.div>

      </motion.section>

    </motion.div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  green,
}) {

  return (

    <motion.div
      variants={staggerItem}
    >

      <GlassPanel className="p-5">

        <div className="flex items-center justify-between">

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

            {title}

          </p>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-blue-400">

            <Icon size={18} />

          </div>

        </div>

        <h2

          className={`

            mt-6 text-4xl font-black tracking-tight

            ${
              green
                ? "text-green-400"
                : "text-white"
            }
          `}
        >

          {value}

        </h2>

      </GlassPanel>

    </motion.div>
  );
}

export default React.memo(
  Strategies
);