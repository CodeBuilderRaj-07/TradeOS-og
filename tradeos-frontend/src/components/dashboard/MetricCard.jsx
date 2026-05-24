import { motion } from "framer-motion";
import React from "react";

import {
  staggerItem,
} from "@/animations/stagger";

import {
  hoverLift,
} from "@/animations/hover";

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}) {

  return (

    <motion.div

      variants={staggerItem}

      initial="hidden"

      animate="show"

      {...hoverLift}

      className="group relative overflow-hidden <GlassPanel /> p-5 backdrop-blur-2xl transition-all duration-300 hover:border-blue-500/10 hover:shadow-[0_0_40px_rgba(37,99,235,0.08)]"
    >

      {/* Glow */}
      <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

              {title}

            </p>

          </div>

          <motion.div

            whileHover={{
              rotate: 6,
              scale: 1.08,
            }}

            transition={{
              duration: 0.2,
            }}

            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/10 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.12)]"
          >

            <Icon size={18} />

          </motion.div>

        </div>

        {/* Value */}
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
            delay: 0.1,
            duration: 0.3,
          }}

          className="mt-6 text-3xl font-bold tracking-tight text-white"
        >

          {value}

        </motion.h2>

        {/* Change */}
        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.18,
          }}

          className="mt-2 text-xs font-medium text-green-400"
        >

          {change}

        </motion.p>

      </div>

    </motion.div>
  );
}

export default React.memo(
  MetricCard
);