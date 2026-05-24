import React, {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Flame,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";

import API from "@/services/api";

import GlassPanel
  from "@/components/ui/GlassPanel";

import CalendarSkeleton
  from "@/components/skeletons/CalendarSkeleton";

import {
  pageTransition,
} from "@/animations/page";

import {
  staggerContainer,
  staggerItem,
} from "@/animations/stagger";

function Calendar() {

  const [calendarData,
    setCalendarData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchCalendar();

  }, []);

  const fetchCalendar =
    async () => {

      try {

        const response =
          await API.get(
            "/calendar"
          );

        setCalendarData(
          response.data || []
        );

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /* Loading */
  if (loading) {

    return (
      <CalendarSkeleton />
    );
  }

  /* Metrics */
  const totalPnl =
    calendarData.reduce(
      (total, item) =>
        total + item.pnl,
      0
    );

  const winningDays =
    calendarData.filter(
      (item) => item.pnl > 0
    ).length;

  const losingDays =
    calendarData.filter(
      (item) => item.pnl < 0
    ).length;

  const bestDay =
    Math.max(
      ...calendarData.map(
        (item) => item.pnl
      ),
      0
    );

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

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-black tracking-tight text-white">

              Trading Calendar

            </h1>

            <p className="mt-2 text-sm text-zinc-500">

              Real daily trading performance

            </p>

          </div>

        </div>

      </motion.div>

      {/* Top Metrics */}
      <motion.section

        variants={staggerContainer}

        initial="hidden"

        animate="show"

        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >

        <TopCard
          title="TOTAL PNL"
          value={`$${totalPnl.toFixed(
            2
          )}`}
          green={totalPnl > 0}
        />

        <TopCard
          title="WINNING DAYS"
          value={winningDays}
        />

        <TopCard
          title="LOSS DAYS"
          value={losingDays}
        />

        <TopCard
          title="BEST DAY"
          value={`$${bestDay.toFixed(
            2
          )}`}
          green
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

        {/* Activity */}
        <motion.div
          variants={staggerItem}
        >

          <GlassPanel className="p-6">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-white">

                  Trading Activity

                </h3>

                <p className="mt-1 text-sm text-zinc-500">

                  Real trade history grouped by date

                </p>

              </div>

              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400">

                Live Backend Data

              </div>

            </div>

            {/* Empty */}
            {calendarData.length === 0 && (

              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-white/5 bg-[#0B1120]/50 text-center">

                <h2 className="text-2xl font-bold text-white">

                  No Trading Activity

                </h2>

                <p className="mt-3 text-sm text-zinc-500">

                  Your daily pnl history will appear here.

                </p>

              </div>

            )}

            {/* Grid */}
            <motion.div

              variants={staggerContainer}

              initial="hidden"

              animate="show"

              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >

              {calendarData.map(
                (
                  item,
                  index
                ) => (

                  <motion.div
                    key={index}
                    variants={staggerItem}
                  >

                    <GlassPanel

                      className={`

                        min-h-[140px]
                        p-5

                        ${
                          item.pnl < 0

                            ? "border-red-500/10 bg-red-500/[0.03]"

                            : "border-green-500/10 bg-green-500/[0.03]"
                        }
                      `}
                    >

                      <p className="text-xs font-medium text-zinc-500">

                        {item.date}

                      </p>

                      <h2

                        className={`

                          mt-6 text-3xl font-black tracking-tight

                          ${
                            item.pnl < 0

                              ? "text-red-400"

                              : "text-green-400"
                          }
                        `}
                      >

                        $
                        {item.pnl.toFixed(
                          2
                        )}

                      </h2>

                      <p

                        className={`

                          mt-3 text-xs font-semibold uppercase tracking-[0.18em]

                          ${
                            item.pnl < 0

                              ? "text-red-400"

                              : "text-green-400"
                          }
                        `}
                      >

                        {item.pnl < 0
                          ? "Loss Day"
                          : "Winning Day"}

                      </p>

                    </GlassPanel>

                  </motion.div>
                )
              )}

            </motion.div>

          </GlassPanel>

        </motion.div>

        {/* Right Side */}
        <motion.div

          variants={staggerContainer}

          className="space-y-4"
        >

          {/* Insights */}
          <motion.div
            variants={staggerItem}
          >

            <GlassPanel className="p-6">

              <div className="flex items-center gap-3">

                <TrendingUp
                  size={18}
                  className="text-green-400"
                />

                <h3 className="text-lg font-bold text-white">

                  Performance Insights

                </h3>

              </div>

              <div className="mt-8 space-y-6">

                <InsightItem
                  title="Best Trading Day"
                  value={`$${bestDay.toFixed(
                    2
                  )}`}
                  green
                />

                <InsightItem
                  title="Winning Days"
                  value={winningDays}
                />

                <InsightItem
                  title="Losing Days"
                  value={losingDays}
                />

              </div>

            </GlassPanel>

          </motion.div>

          {/* Risk */}
          <motion.div
            variants={staggerItem}
          >

            <GlassPanel className="p-6">

              <div className="flex items-center gap-3">

                <AlertTriangle
                  size={18}
                  className="text-red-400"
                />

                <h3 className="text-lg font-bold text-white">

                  Risk Notice

                </h3>

              </div>

              <div className="mt-6 rounded-2xl border border-red-500/10 bg-red-500/5 p-5 text-sm leading-7 text-zinc-300">

                Calendar analytics are powered by real backend trading data and live account performance.

              </div>

            </GlassPanel>

          </motion.div>

          {/* Activity */}
          <motion.div
            variants={staggerItem}
          >

            <GlassPanel className="p-6">

              <div className="flex items-center gap-3">

                <Flame
                  size={18}
                  className="text-orange-400"
                />

                <h3 className="text-lg font-bold text-white">

                  Trading Activity

                </h3>

              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-green-400">

                {calendarData.length}

              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-500">

                Total active trading days recorded in your account history.

              </p>

            </GlassPanel>

          </motion.div>

        </motion.div>

      </motion.section>

    </motion.div>
  );
}

function TopCard({
  title,
  value,
  green,
}) {

  return (

    <motion.div
      variants={staggerItem}
    >

      <GlassPanel className="p-5">

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

          {title}

        </p>

        <h2

          className={`

            mt-5 text-4xl font-black tracking-tight

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

function InsightItem({
  title,
  value,
  green,
}) {

  return (

    <div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

        {title}

      </p>

      <h2

        className={`

          mt-2 text-3xl font-black tracking-tight

          ${
            green
              ? "text-green-400"
              : "text-white"
          }
        `}
      >

        {value}

      </h2>

    </div>
  );
}

export default React.memo(
  Calendar
);