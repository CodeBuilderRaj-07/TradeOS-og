import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { createChart } from "lightweight-charts";

import { staggerItem } from "@/animations/stagger";
import { hoverLift } from "@/animations/hover";

function MarketChartCard() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 380,

      layout: {
        background: { color: "transparent" },
        textColor: "#71717A",
      },

      grid: {
        vertLines: { color: "rgba(255,255,255,0.03)" },
        horzLines: { color: "rgba(255,255,255,0.03)" },
      },

      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
      },

      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22C55E",
      downColor: "#EF4444",
      borderVisible: false,
      wickUpColor: "#22C55E",
      wickDownColor: "#EF4444",
    });

    // No hardcoded data — chart starts empty

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="show"
      {...hoverLift}
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 backdrop-blur-2xl transition-all duration-300 hover:border-success/10 hover:shadow-glow-green"
    >
      {/* Glow */}
      <div className="absolute right-[-80px] top-[-80px] h-60 w-60 rounded-full bg-success/10 blur-3xl transition-all duration-500 group-hover:bg-success/20" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Market Chart
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Live candlestick visualization
            </p>
          </div>

          <div className="rounded-lg border border-success/10 bg-success/10 px-4 py-2 text-xs font-semibold text-green-400">
            ACTIVE
          </div>
        </div>

        {/* Chart */}
        <div
          ref={chartContainerRef}
          className="h-[380px] w-full rounded-lg"
        />
      </div>
    </motion.div>
  );
}

export default React.memo(MarketChartCard);