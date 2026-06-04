import { forwardRef } from "react"

const Select = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
})
Select.displayName = "Select"

const SelectField = Select

export { SelectField, Select }
