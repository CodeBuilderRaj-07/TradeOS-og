import { useMemo } from "react"
import Card from "@/components/ui/Card"
import { ShieldCheck } from "lucide-react"

export default function DisciplineScore({ score, trades = [] }) {
  const computedScore = useMemo(() => {
    if (score > 0) return score
    if (!trades.length) return 0
    const closed = trades.filter((t) => t.status !== "open")
    if (!closed.length) return 0
    const avg =
      closed.reduce((s, t) => s + (t.discipline_score || 0), 0) /
      closed.length
    return Math.round(avg)
  }, [score, trades])

  const colorClass =
    computedScore >= 80
      ? "text-emerald-400"
      : computedScore >= 60
        ? "text-yellow-400"
        : "text-red-400"

  const label =
    computedScore >= 90
      ? "Elite"
      : computedScore >= 80
        ? "Disciplined"
        : computedScore >= 60
          ? "Average"
          : computedScore >= 40
            ? "Risky"
            : "Critical"

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (computedScore / 100) * circumference

  return (
    <Card className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Discipline Score
        </h3>
      </div>

      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-1000 ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold font-mono ${colorClass}`}>
            {computedScore}
          </span>
        </div>
      </div>

      <span className={`text-xs font-medium mt-2 ${colorClass}`}>{label}</span>
    </Card>
  )
}
