import React, { useMemo, useCallback } from "react";

import { motion } from "framer-motion";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";

import { Download } from "lucide-react";
import AnalyticsSkeleton from "@/components/skeletons/AnalyticsSkeleton";

import GlassPanel from "@/components/ui/GlassPanel";

import { useAnalytics } from "@/hooks/useAnalytics";

import { pageTransition } from "@/animations/page";
import { staggerContainer, staggerItem } from "@/animations/stagger";
import { errorToast } from "@/services/toastService";
import API from "@/services/api";

const COLORS = ["#3b82f6", "#34d399", "#f87171", "#facc15", "#a78bfa", "#f472b6"];

function Analytics() {
  const { summary, monthlyPnl, bySymbol, loading } = useAnalytics();

  const exportCSV = useCallback(async () => {
    try {
      const res = await API.get("/trades?limit=5000");
      const trades = res.data || [];
      if (!trades.length) return;
      const headers = ["Symbol","Direction","Entry","Exit","Size","P&L","Status","Entry Date","Exit Date","Tags"];
      const rows = trades.map((t) => [
        t.symbol, t.tradeType, t.entryPrice, t.exitPrice, t.positionSize,
        t.pnl, t.status, t.createdAt, t.updatedAt, (t.tags || []).join(";"),
      ].map((v) => `"${v ?? ""}"`).join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `tradeos_export_${new Date().toISOString().slice(0,10)}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch { errorToast("Failed to export CSV"); }
  }, []);

  const closedTrades = summary?.closedTrades || 0;
  const winRate = summary?.winRate || 0;
  const totalPnl = summary?.totalPnl || 0;
  const profitFactor = summary?.profitFactor || 0;
  const avgRR = summary?.avgRR || summary?.averageRiskReward || 0;

  const directionData = useMemo(() => [
    { name: "Long", value: summary?.longTrades || 0 },
    { name: "Short", value: summary?.shortTrades || 0 },
  ], [summary]);

  const sessionData = useMemo(() => [
    { name: "Asian", winRate: summary?.asianWinRate || 0, trades: summary?.asianTrades || 0 },
    { name: "London", winRate: summary?.londonWinRate || 0, trades: summary?.londonTrades || 0 },
    { name: "New York", winRate: summary?.nyWinRate || 0, trades: summary?.nyTrades || 0 },
    { name: "Overlap", winRate: summary?.overlapWinRate || 0, trades: summary?.overlapTrades || 0 },
  ], [summary]);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div variants={staggerItem} initial="hidden" animate="show" className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">{closedTrades} closed trades analyzed</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-card/80 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </motion.div>

      {/* Stats */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="WIN RATE" value={`${winRate.toFixed(1)}%`} />
        <StatCard title="TOTAL P&L" value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`} green={totalPnl >= 0} />
        <StatCard title="PROFIT FACTOR" value={profitFactor ? profitFactor.toFixed(2) : "—"} />
        <StatCard title="AVG R:R" value={avgRR ? `1:${Number(avgRR).toFixed(2)}` : "—"} />
      </motion.section>

      {/* Charts */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" transition={{ delayChildren: 0.1 }} className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Cumulative P&L */}
        <motion.div variants={staggerItem}>
          <GlassPanel className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Cumulative P&L</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPnl} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(230 15% 8% / 0.9)", border: "1px solid hsl(230 12% 16%)", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2} fill="url(#pnlGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Direction Breakdown */}
        <motion.div variants={staggerItem}>
          <GlassPanel className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Direction Breakdown</h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={directionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                    {directionData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(230 15% 8% / 0.9)", border: "1px solid hsl(230 12% 16%)", borderRadius: "8px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {directionData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span>{d.name}</span>
                  <span className="font-medium text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Performance by Pair */}
        <motion.div variants={staggerItem}>
          <GlassPanel className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Performance by Pair</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySymbol.slice(0, 6)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis dataKey="symbol" tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(230 15% 8% / 0.9)", border: "1px solid hsl(230 12% 16%)", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(value, name, props) => [`$${value.toFixed(2)}`, `${props.payload.symbol} PnL`]}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {bySymbol.slice(0, 6).map((entry, i) => (
                      <Cell key={i} fill={(entry.pnl || 0) >= 0 ? "#34d399" : "#f87171"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Session Breakdown */}
        <motion.div variants={staggerItem}>
          <GlassPanel className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Session Breakdown</h3>
            <div className="space-y-3">
              {sessionData.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.trades} trades</p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${s.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>
                    {s.winRate.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}

function StatCard({ title, value, green }) {
  return (
    <motion.div variants={staggerItem}>
      <GlassPanel className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
        <h2 className={`mt-5 text-3xl font-bold tracking-tight ${green !== undefined ? (green ? "text-emerald-400" : "text-red-400") : "text-foreground"}`}>
          {value}
        </h2>
      </GlassPanel>
    </motion.div>
  );
}

export default React.memo(Analytics);
