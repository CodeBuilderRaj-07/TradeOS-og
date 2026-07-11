import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import { useNavigate } from "react-router-dom";
import { Bot, Plus, Play, Square, Trash2, ExternalLink, Activity, TrendingUp, TrendingDown } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import API from "@/services/api";
import { successToast, errorToast } from "@/services/toastService";

const STATUS_COLORS = {
  RUNNING: "text-green-400 bg-green-500/10 border-green-500/30",
  PAUSED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  STOPPED: "text-muted-foreground bg-muted/20 border-border",
};

const TRIGGER_LABELS = {
  IMMEDIATE: "Immediate",
  PRICE_ABOVE: "Price Above",
  PRICE_BELOW: "Price Below",
};

export default function AlgoTrading() {
  const navigate = useNavigate();
  const [algos, setAlgos] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchData = async () => {
    try {
      const [algoRes, execRes] = await Promise.all([
        API.get("/algo-strategies"),
        API.get("/algo-executions"),
      ]);
      setAlgos(algoRes.data || []);
      setExecutions(execRes.data || []);
    } catch {
      errorToast("Failed to load algo data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleAlgo = async (id, currentActive) => {
    try {
      await API.put(`/algo-strategies/${id}/toggle`, { active: !currentActive });
      successToast(currentActive ? "Algo stopped" : "Algo started");
      fetchData();
    } catch {
      errorToast("Failed to toggle algo");
    }
  };

  const doDeleteAlgo = async () => {
    if (!confirmDelete) return;
    try {
      await API.delete(`/algo-strategies/${confirmDelete.id}`);
      successToast("Algo deleted");
      setConfirmDelete(null);
      fetchData();
    } catch {
      errorToast("Failed to delete algo");
    }
  };

  const getExecStats = (algoId) => {
    const algoExecs = executions.filter((e) => e.algoStrategyId === algoId);
    const total = algoExecs.length;
    const wins = algoExecs.filter((e) => e.pnl > 0).length;
    const closed = algoExecs.filter((e) => e.status === "CLOSED").length;
    const open = algoExecs.filter((e) => e.status === "OPEN").length;
    const totalPnl = algoExecs.reduce((sum, e) => sum + (e.pnl || 0), 0);
    const winRate = closed > 0 ? (wins / closed) * 100 : 0;
    return { total, wins, open, totalPnl, winRate, closed };
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="skeleton h-10 w-56 rounded-xl" />
        <div className="skeleton mt-3 h-4 w-72 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => <div key={i} className="glass p-6 h-48"><div className="skeleton h-full w-full rounded-lg" /></div>)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Algo Trading</h1>
              <p className="mt-1 text-sm text-muted-foreground">Automated strategy execution engine</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/algo/new")}
          className="flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
        >
          <Plus size={16} />
          New Algo
        </button>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassPanel className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Algos</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{algos.filter((a) => a.active).length}<span className="text-sm font-medium text-muted-foreground ml-1">/ {algos.length}</span></p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Open Positions</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">{executions.filter((e) => e.status === "OPEN").length}</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Trades</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{executions.length}</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Win Rate</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {executions.length > 0
              ? `${((executions.filter((e) => e.pnl > 0).length / executions.filter((e) => e.status === "CLOSED").length) * 100).toFixed(0)}%`
              : "—"}
          </p>
        </GlassPanel>
      </motion.div>

      <motion.div variants={staggerItem}>
        {/* Algo Grid */}
      {algos.length === 0 ? (
        <GlassPanel className="p-14 text-center">
          <Bot size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground">No algo strategies yet</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Create automated trading strategies that execute based on market conditions. Connect your trading account and let the algo run 24/7.
          </p>
          <button
            onClick={() => navigate("/algo/new")}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
          >
            <Plus size={16} />
            Create Your First Algo
          </button>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {algos.map((algo) => {
            const stats = getExecStats(algo.id);
            return (
              <motion.div
                key={algo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <GlassPanel className={`p-5 border-l-4 ${algo.active ? "border-l-green-500/50" : "border-l-border"}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground truncate">{algo.name}</h3>
                      {algo.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{algo.description}</p>
                      )}
                    </div>
                    <div className={`ml-2 shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[algo.status] || STATUS_COLORS.STOPPED}`}>
                      {algo.status || "STOPPED"}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Symbol</span>
                      <span className="font-mono font-semibold text-foreground">{algo.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Direction</span>
                      <span className={`font-semibold flex items-center gap-1 ${algo.tradeDirection === "BUY" ? "text-green-400" : "text-red-400"}`}>
                        {algo.tradeDirection === "BUY" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {algo.tradeDirection}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Entry Trigger</span>
                      <span className="font-mono text-foreground">{TRIGGER_LABELS[algo.entryTrigger] || algo.entryTrigger}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Position Size</span>
                      <span className="font-mono text-foreground">{algo.positionSize}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Activity size={12} className="text-muted-foreground" />
                      <span className="text-muted-foreground">{stats.total} trades</span>
                    </div>
                    {stats.open > 0 && (
                      <span className="text-blue-400 font-medium">{stats.open} open</span>
                    )}
                    {stats.totalPnl !== 0 && (
                      <span className={`font-mono font-semibold ${stats.totalPnl > 0 ? "text-green-400" : "text-red-400"}`}>
                        {stats.totalPnl > 0 ? "+" : ""}{stats.totalPnl.toFixed(2)}
                      </span>
                    )}
                    {stats.closed > 0 && (
                      <span className={`font-mono font-semibold ${stats.winRate >= 50 ? "text-green-400" : "text-red-400"}`}>
                        {stats.winRate.toFixed(0)}% WR
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlgo(algo.id, algo.active)}
                      className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all ${
                        algo.active
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                          : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                      }`}
                    >
                      {algo.active ? <Square size={12} /> : <Play size={12} />}
                      {algo.active ? "Stop" : "Start"}
                    </button>
                    <button
                      onClick={() => navigate(`/algo/${algo.id}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(algo)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Executions */}
      {executions.length > 0 && (
        <GlassPanel className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Executions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="text-left pb-3 pr-4">Symbol</th>
                  <th className="text-left pb-3 pr-4">Direction</th>
                  <th className="text-left pb-3 pr-4">Entry</th>
                  <th className="text-left pb-3 pr-4">Exit</th>
                  <th className="text-left pb-3 pr-4">PnL</th>
                  <th className="text-left pb-3 pr-4">Status</th>
                  <th className="text-left pb-3 pr-4">Trigger</th>
                </tr>
              </thead>
              <tbody>
                {executions.slice(0, 10).map((exec) => (
                  <tr key={exec.id} className="border-b border-border/50 hover:bg-background/30 transition-colors">
                    <td className="py-3 pr-4 font-mono font-semibold text-foreground">{exec.symbol}</td>
                    <td className={`py-3 pr-4 font-semibold ${exec.tradeDirection === "BUY" ? "text-green-400" : "text-red-400"}`}>
                      {exec.tradeDirection}
                    </td>
                    <td className="py-3 pr-4 font-mono text-foreground">{exec.entryPrice?.toFixed(2)}</td>
                    <td className="py-3 pr-4 font-mono text-muted-foreground">{exec.exitPrice ? exec.exitPrice.toFixed(2) : "—"}</td>
                    <td className={`py-3 pr-4 font-mono font-semibold ${exec.pnl > 0 ? "text-green-400" : exec.pnl < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                      {exec.pnl ? `${exec.pnl > 0 ? "+" : ""}${exec.pnl.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${exec.status === "OPEN" ? "text-blue-400 bg-blue-500/10" : "text-muted-foreground bg-muted/20"}`}>
                        {exec.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">{exec.triggerReason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={doDeleteAlgo}
        title="Delete Algo"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
    </motion.div>
  );
}
