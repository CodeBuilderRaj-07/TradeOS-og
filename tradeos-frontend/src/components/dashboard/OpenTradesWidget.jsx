import { useNavigate } from "react-router-dom"
import Card from "@/components/ui/Card"
import { ArrowRight, ArrowUp, ArrowDown, Clock } from "lucide-react"

function formatDate(dateStr) {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return d.toLocaleDateString("en", { month: "short", day: "numeric" })
}

export default function OpenTradesWidget({ trades = [] }) {
  const navigate = useNavigate()
  const open = trades.filter((t) => t.status === "OPEN")

  return (
    <Card glow={open.length > 0 ? "blue" : undefined}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-glow" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Open Trades
          </h3>
          <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-mono">
            {open.length}
          </span>
        </div>
        <button
          onClick={() => navigate("/trades/open")}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {open.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">
          No open trades
        </div>
      ) : (
        <div className="space-y-2">
          {open.slice(0, 5).map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/10"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    t.tradeType === "LONG" || t.tradeType === "BUY"
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {t.tradeType === "LONG" || t.tradeType === "BUY" ? (
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.symbol}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {t.createdAt ? formatDate(t.createdAt) : "-"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-mono">
                  {t.entryPrice}
                </p>
                <p className="text-xs text-muted-foreground">
                  SL: {t.stopLoss} / TP: {t.takeProfit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
