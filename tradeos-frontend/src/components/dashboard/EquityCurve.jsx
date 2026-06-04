import { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import Card from "@/components/ui/Card"

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-mono font-semibold text-foreground">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function EquityCurve({ trades = [], initialBalance = 0 }) {
  const data = useMemo(() => {
    if (!trades.length) {
      return initialBalance ? [{ date: "Start", balance: initialBalance }] : []
    }

    const sorted = [...trades]
      .filter((t) => t.pnl != null)
      .sort(
        (a, b) =>
          new Date(a.exit_date || a.created_date) -
          new Date(b.exit_date || b.created_date)
      )

    let bal = initialBalance
    return [
      { date: "Start", balance: bal },
      ...sorted.map((t) => {
        bal += t.pnl || 0
        return {
          date: new Date(t.exit_date || t.created_date).toLocaleDateString("en", {
            month: "short",
            day: "numeric",
          }),
          balance: Math.round(bal * 100) / 100,
        }
      }),
    ]
  }, [trades, initialBalance])

  const lastBalance = data[data.length - 1]?.balance || initialBalance
  const isPositive = lastBalance >= initialBalance

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Equity Curve</h3>
          <p className="text-xl font-bold font-mono mt-1">
            ${lastBalance.toLocaleString()}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md ${
            isPositive
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-red-400/10 text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {((lastBalance - initialBalance) / initialBalance * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? "#34d399" : "#f87171"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? "#34d399" : "#f87171"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={isPositive ? "#34d399" : "#f87171"}
              strokeWidth={2}
              fill="url(#equityGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
