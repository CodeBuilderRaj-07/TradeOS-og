import { motion } from "framer-motion"

export default function Card({ children, className, glow, animate = true, ...props }) {
  const Comp = animate ? motion.div : "div"
  const animProps = animate
    ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }
    : {}

  const glowClass = glow === "blue" ? "glow-blue" : glow === "green" ? "glow-green" : glow === "red" ? "glow-red" : ""

  return (
    <Comp
      className={`glass rounded-xl p-4 md:p-5 hover-lift ${glowClass} ${className || ""}`}
      {...animProps}
      {...props}
    >
      {children}
    </Comp>
  )
}
