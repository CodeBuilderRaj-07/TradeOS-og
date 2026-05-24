import { motion } from "framer-motion";

import {
  hoverLift,
} from "@/animations/hover";

export default function GlassPanel({
  children,
  className = "",
}) {

  return (

    <motion.div

      {...hoverLift}

      className={`

        relative overflow-hidden
        rounded-3xl
        border border-white/5
        bg-white/[0.03]
        backdrop-blur-2xl
        transition-all duration-300

        hover:border-blue-500/10
        hover:shadow-[0_0_40px_rgba(37,99,235,0.08)]

        ${className}
      `}
    >

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />

      <div className="relative z-10">

        {children}

      </div>

    </motion.div>
  );
}