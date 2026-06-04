import { motion } from "framer-motion";

export default function GlassPanel({
  children,
  className = "",
  glow,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`hover-lift ${
        glow === "blue" ? "glow-blue" : glow === "green" ? "glow-green" : glow === "red" ? "glow-red" : ""
      } glass ${className}`}
    >
      {children}
    </motion.div>
  );
}
