import { forwardRef } from "react"
import { motion } from "framer-motion"

const InputField = forwardRef(
  ({ label, icon: Icon, className = "", ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        {label && (
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </label>
        )}

        <div className="flex h-14 items-center gap-3 rounded-lg border border-border bg-background/70 px-4 transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-glow">
          {Icon && <Icon size={18} className="text-muted-foreground shrink-0" />}

          <input
            ref={ref}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            {...props}
          />
        </div>
      </motion.div>
    )
  }
)
InputField.displayName = "InputField"

export default InputField
