import React from "react";

import {
  useEffect,
  useRef,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  createChart,
} from "lightweight-charts";

import {
  staggerItem,
} from "@/animations/stagger";

import {
  hoverLift,
} from "@/animations/hover";

function MarketChartCard() {

  const chartContainerRef =
    useRef(null);

  useEffect(() => {

    if (!chartContainerRef.current)
      return;

    const chart =
      createChart(
        chartContainerRef.current,
        {
          width:
            chartContainerRef.current
              .clientWidth,

          height: 380,

          layout: {

            background: {
              color:
                "transparent",
            },

            textColor:
              "#71717A",
          },

          grid: {

            vertLines: {

              color:
                "rgba(255,255,255,0.03)",
            },

            horzLines: {

              color:
                "rgba(255,255,255,0.03)",
            },
          },

          rightPriceScale: {

            borderColor:
              "rgba(255,255,255,0.08)",
          },

          timeScale: {

            borderColor:
              "rgba(255,255,255,0.08)",
          },
        }
      );

    const candleSeries =
      chart.addCandlestickSeries({

        upColor:
          "#22C55E",

        downColor:
          "#EF4444",

        borderVisible:
          false,

        wickUpColor:
          "#22C55E",

        wickDownColor:
          "#EF4444",
      });

    candleSeries.setData([

      {
        time: 1735689600,
        open: 96000,
        high: 96800,
        low: 95500,
        close: 96500,
      },

      {
        time: 1735776000,
        open: 96500,
        high: 97800,
        low: 96000,
        close: 97500,
      },

      {
        time: 1735862400,
        open: 97500,
        high: 99000,
        low: 97000,
        close: 98800,
      },

      {
        time: 1735948800,
        open: 98800,
        high: 100800,
        low: 98200,
        close: 100200,
      },
    ]);

    const handleResize =
      () => {

        chart.applyOptions({

          width:
            chartContainerRef.current
              ?.clientWidth,
        });
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();
    };

  }, []);

  return (

    <motion.div

      variants={staggerItem}

      initial="hidden"

      animate="show"

      {...hoverLift}

      className="group relative overflow-hidden <GlassPanel /> p-6 backdrop-blur-2xl transition-all duration-300 hover:border-green-500/10 hover:shadow-[0_0_45px_rgba(34,197,94,0.08)]"
    >

      {/* Glow */}
      <div className="absolute right-[-80px] top-[-80px] h-60 w-60 rounded-full bg-green-500/10 blur-3xl transition-all duration-500 group-hover:bg-green-500/20" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>

            <motion.h2

              initial={{
                opacity: 0,
                y: 6,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.3,
              }}

              className="text-xl font-bold text-white"
            >

              BTCUSDT Market Chart

            </motion.h2>

            <motion.p

              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              transition={{
                delay: 0.1,
              }}

              className="mt-1 text-sm text-zinc-500"
            >

              Professional candlestick visualization

            </motion.p>

          </div>

          {/* Status */}
          <motion.div

            whileHover={{
              scale: 1.05,
            }}

            className="rounded-2xl border border-green-500/10 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.08)]"
          >

            ACTIVE

          </motion.div>

        </div>

        {/* Chart */}
        <motion.div

          initial={{
            opacity: 0,
            y: 8,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.15,
            duration: 0.35,
          }}

          ref={chartContainerRef}

          className="h-[380px] w-full rounded-2xl"
        />

      </div>

    </motion.div>
  );
}

export default React.memo(
  MarketChartCard
);