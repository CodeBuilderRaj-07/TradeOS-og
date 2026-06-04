import { motion } from "framer-motion"
import React from "react"

function MetricCard({
  title,
  value,
  icon: Icon,
  onClick,
  trend,
  delay = 0,
}) {
  const isUp = trend === "up"
  const isDown = trend === "down"

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      onClick={onClick}
      className={`glass rounded-xl p-4 md:p-5 text-left w-full group transition-all duration-200 ${
        onClick
          ? "hover:border-white/10 hover:scale-[1.01] cursor-pointer active:scale-[0.99]"
          : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>

        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      <p
        className={`text-2xl md:text-3xl font-bold font-mono tracking-tight ${
          isUp
            ? "text-emerald-400"
            : isDown
              ? "text-red-400"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
    </motion.button>
  )
}

export default React.memo(MetricCard)
