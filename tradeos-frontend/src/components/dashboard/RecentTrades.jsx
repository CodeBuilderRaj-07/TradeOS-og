import { memo } from "react"
import { useNavigate } from "react-router-dom"
import Card from "@/components/ui/Card"
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Clock,
} from "lucide-react"

const statusLabels = {
  OPEN: "Open",
  TP_HIT: "TP Hit",
  SL_HIT: "SL Hit",
  MANUAL: "Manual",
  MANUAL_CLOSE: "Manual",
}

const statusStyles = {
  OPEN: "border-blue-500/20 text-blue-400",
  TP_HIT: "border-emerald-500/20 text-emerald-400",
  SL_HIT: "border-red-500/20 text-red-400",
  MANUAL: "border-yellow-500/20 text-yellow-400",
  MANUAL_CLOSE: "border-yellow-500/20 text-yellow-400",
}

function formatDate(dateStr) {
  if (!dateStr) return "No date"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default memo(function RecentTrades({ trades = [] }) {
  const navigate = useNavigate()
  const recent = trades.slice(0, 8)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Trades</h3>
        <button
          onClick={() => navigate("/journal")}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No trades yet. Log your first trade to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((t) => {
            const sk = (t.status || "OPEN").toUpperCase().replace(/\s+/g, "_")
            const isOpen = sk === "OPEN"
            return (
              <button
                key={t.id}
                onClick={() => navigate(`/trade/${t.id}`)}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors w-full text-left group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      t.tradeType === "LONG" || t.tradeType === "BUY"
                        ? "bg-emerald-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {t.tradeType === "LONG" || t.tradeType === "BUY" ? (
                      <ArrowUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.symbol}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {t.createdAt
                        ? formatDate(t.createdAt)
                        : "No date"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                      statusStyles[sk] || statusStyles.OPEN
                    }`}
                  >
                    {statusLabels[sk] || t.status || "Open"}
                  </span>
                  <span
                    className={`text-sm font-mono font-semibold ${
                      isOpen
                        ? "text-blue-400"
                        : (t.pnl || 0) >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                    }`}
                  >
                    {isOpen
                      ? "Open"
                      : t.pnl != null
                        ? `${t.pnl >= 0 ? "+" : ""}$${t.pnl.toFixed(2)}`
                        : "-"}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
})
