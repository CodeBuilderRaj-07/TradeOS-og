import { forwardRef } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

const buttonVariants = {
  default:
    "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  gradient:
    "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-600",
  "gradient-green":
    "bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600",
  "gradient-red":
    "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:from-red-500 hover:to-red-600",
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 text-xs",
  lg: "h-12 rounded-xl px-8",
  icon: "h-10 w-10",
}

const Button = forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      loading = false,
      disabled = false,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? motion.div : motion.button

    return (
      <Comp
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin shrink-0" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
