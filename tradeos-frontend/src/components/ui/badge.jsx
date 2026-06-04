import { forwardRef } from "react"

const badgeVariants = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow",
  outline: "text-foreground border-border",
  success:
    "border-transparent bg-success/15 text-success shadow-sm",
  warning:
    "border-transparent bg-warning/15 text-warning shadow-sm",
}

const Badge = forwardRef(
  ({ className = "", variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${badgeVariants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
