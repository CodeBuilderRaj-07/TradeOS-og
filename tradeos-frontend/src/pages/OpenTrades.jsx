import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, TrendingDown, Plus, ChevronLeft, ChevronRight, RefreshCw, Edit3, Shield, Scissors, Check, X, Activity, XCircle, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import GlassPanel from "@/components/ui/GlassPanel";
import EmptyTrades from "@/components/trades/EmptyTrades";
import { useOpenTrades } from "@/hooks/useOpenTrades";
import API from "@/services/api";
import { successToast, errorToast } from "@/services/toastService";

const PAGE_SIZE = 12;

const statusAlert = {
  tp_touched: { text: "TP Touched — did it hit full target?", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
  sl_touched: { text: "SL Touched — are you still holding?", color: "border-red-500/20 bg-red-500/5 text-red-400" },
  be_touched: { text: "At Breakeven — consider managing risk", color: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400" },
};

function getStatusBanner(status) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes("tp") || s === "tp_touched") return statusAlert.tp_touched;
  if (s.includes("sl") || s === "sl_touched") return statusAlert.sl_touched;
  if (s.includes("be") || s === "be_touched") return statusAlert.be_touched;
  return null;
}

export default function OpenTrades() {
  const navigate = useNavigate();
  const { trades, loading, error, closeTrade, fetchOpenTrades } = useOpenTrades();
  const [page, setPage] = useState(1);
  const [editingSlTp, setEditingSlTp] = useState(null);
  const [editSl, setEditSl] = useState("");
  const [editTp, setEditTp] = useState("");
  const [closeAllConfirm, setCloseAllConfirm] = useState(false);
  const [closeAllLoading, setCloseAllLoading] = useState(false);
  const [trailStopId, setTrailStopId] = useState(null);
  const [trailOffset, setTrailOffset] = useState("10");
  const [trailLoading, setTrailLoading] = useState(false);
  const [partialCloseId, setPartialCloseId] = useState(null);
  const [partialLoading, setPartialLoading] = useState(false);

  const handleMoveToBe = async (tradeId) => {
    try {
      await API.put(`/trades/${tradeId}/move-to-be`);
      successToast("Stop Loss moved to Breakeven");
      fetchOpenTrades();
    } catch {
      errorToast("Failed to move to breakeven");
    }
  };

  const handlePartialClose = async (tradeId, pct) => {
    try {
      await API.put(`/trades/${tradeId}/partial-close`, { percentage: pct });
      successToast(`Closed ${pct}% of position`);
      fetchOpenTrades();
    } catch {
      errorToast("Failed to partial close");
    }
  };

  const startEditSlTp = (trade) => {
    setEditingSlTp(trade.id);
    setEditSl(trade.stopLoss || "");
    setEditTp(trade.takeProfit || "");
  };

  const handleCloseAll = async () => {
    try {
      setCloseAllLoading(true);
      const res = await API.post("/trades/close-all");
      const results = res.data?.results || [];
      results.forEach((r) => successToast(r));
      setCloseAllConfirm(false);
      fetchOpenTrades();
    } catch {
      errorToast("Failed to close all trades");
    } finally {
      setCloseAllLoading(false);
    }
  };

  const handleTrailStop = async (tradeId) => {
    try {
      setTrailLoading(true);
      await API.put(`/trades/${tradeId}/trail-stop`, { offset: Number(trailOffset) });
      successToast(`Trail stop activated (offset: ${trailOffset})`);
      setTrailStopId(null);
      fetchOpenTrades();
    } catch {
      errorToast("Failed to set trail stop");
    } finally {
      setTrailLoading(false);
    }
  };

  const handlePartialClosePct = async (tradeId, pct) => {
    try {
      setPartialLoading(true);
      await API.put(`/trades/${tradeId}/partial-close`, { percentage: pct });
      successToast(`Closing ${pct}%`);
      setPartialCloseId(null);
      fetchOpenTrades();
    } catch {
      errorToast("Failed to partial close");
    } finally {
      setPartialLoading(false);
    }
  };

  const saveSlTp = async (tradeId) => {
    try {
      await API.put(`/trades/${tradeId}/sl-tp`, {
        stopLoss: Number(editSl),
        takeProfit: Number(editTp),
      });
      successToast("SL/TP updated");
      setEditingSlTp(null);
      fetchOpenTrades();
    } catch {
      errorToast("Failed to update SL/TP");
    }
  };

  const totalPages = Math.max(1, Math.ceil(trades.length / PAGE_SIZE));
  const paginated = trades.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="space-y-4 max-w-[1600px] mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-6 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && trades.length === 0) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Open Trades</h1>
        <GlassPanel className="p-14 text-center">
          <h2 className="text-xl font-bold text-foreground">Failed to load trades</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={fetchOpenTrades}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </GlassPanel>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1600px] mx-auto"
    >
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Open Trades</h1>
          <p className="text-sm text-muted-foreground mt-1">{trades.length} active position{trades.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOpenTrades}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          {trades.length > 0 && (
            <button
              onClick={() => setCloseAllConfirm(true)}
              className="flex h-11 items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <XCircle size={16} />
              Close All
            </button>
          )}
          <button
            onClick={() => navigate("/new-trade")}
            className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Log New Trade
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        {trades.length === 0 ? (
          <EmptyTrades />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map((trade, i) => {
              const isLong = (trade.tradeType || "BUY") === "BUY";
              const banner = getStatusBanner(trade.status);
              const pnl = trade.pnl || 0;
              return (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <GlassPanel className="p-5 space-y-4">
                    {banner && (
                      <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${banner.color}`}>
                        {banner.text}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isLong ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                          {isLong ? (
                            <ArrowUpRight size={18} className="text-emerald-400" />
                          ) : (
                            <ArrowDownRight size={18} className="text-red-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{trade.symbol || trade.pair}</h3>
                          <p className="text-xs text-muted-foreground capitalize">{trade.tradeType}</p>
                        </div>
                      </div>
                      <div className={`text-right ${pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        <p className="text-lg font-bold font-mono">{pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">P&L</p>
                      </div>
                    </div>

                    {/* Tags */}
                    {trade.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {trade.tags.split(",").map((tag, ti) => (
                          <span key={ti} className="flex items-center gap-1 rounded-md border border-primary/10 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                            <Tag size={10} />
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Entry</p>
                        <p className="mt-1 text-sm font-mono font-medium text-foreground">${trade.entryPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current</p>
                        <p className="mt-1 text-sm font-mono font-medium text-foreground/80">${trade.currentPrice || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stop Loss</p>
                        {editingSlTp === trade.id ? (
                          <input
                            type="number"
                            step="any"
                            value={editSl}
                            onChange={(e) => setEditSl(e.target.value)}
                            className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm font-mono text-red-400 outline-none text-center"
                          />
                        ) : (
                          <p className="mt-1 text-sm font-mono font-medium text-red-400">${trade.stopLoss || "—"}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Take Profit</p>
                        {editingSlTp === trade.id ? (
                          <input
                            type="number"
                            step="any"
                            value={editTp}
                            onChange={(e) => setEditTp(e.target.value)}
                            className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm font-mono text-emerald-400 outline-none text-center"
                          />
                        ) : (
                          <p className="mt-1 text-sm font-mono font-medium text-emerald-400">${trade.takeProfit || "—"}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {editingSlTp === trade.id ? (
                        <>
                          <button
                            onClick={() => saveSlTp(trade.id)}
                            className="flex-1 rounded-lg bg-emerald-500/20 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          >
                            <Check size={14} className="inline mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSlTp(null)}
                            className="flex-1 rounded-lg border border-border bg-card py-2.5 text-xs font-semibold text-muted-foreground hover:bg-sidebar-accent transition-colors"
                          >
                            <X size={14} className="inline mr-1" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/trade/${trade.id}`)}
                            className="flex-1 rounded-lg border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-sidebar-accent transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => startEditSlTp(trade)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                            title="Edit SL/TP"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveToBe(trade.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                            title="Move to Breakeven"
                          >
                            <Shield size={14} />
                          </button>
                          {trailStopId === trade.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="any"
                                value={trailOffset}
                                onChange={(e) => setTrailOffset(e.target.value)}
                                className="w-16 h-10 rounded-lg border border-border bg-background px-2 text-xs font-mono text-foreground outline-none text-center"
                                placeholder="10"
                                autoFocus
                              />
                              <button
                                onClick={() => handleTrailStop(trade.id)}
                                disabled={trailLoading}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                title="Confirm Trail Stop"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setTrailStopId(null)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setTrailStopId(trade.id); setTrailOffset("10"); }}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                              title="Trail Stop"
                            >
                              <Activity size={14} />
                            </button>
                          )}
                          {partialCloseId === trade.id ? (
                            <div className="flex items-center gap-1">
                              {[25, 50, 75].map((pct) => (
                                <button
                                  key={pct}
                                  onClick={() => handlePartialClosePct(trade.id, pct)}
                                  disabled={partialLoading}
                                  className="h-10 w-10 rounded-lg bg-purple-500/20 text-xs font-bold text-purple-400 hover:bg-purple-500/30 transition-colors"
                                >
                                  {pct}%
                                </button>
                              ))}
                              <button
                                onClick={() => setPartialCloseId(null)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setPartialCloseId(trade.id)}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                              title="Partial Close"
                            >
                              <Scissors size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => closeTrade(trade.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            title="Close Trade"
                          >
                            <TrendingDown size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {trades.length > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, trades.length)} of {trades.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 min-w-[36px] rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>

      {/* Close All Confirmation Dialog */}
      {closeAllConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-2">Close All Trades?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will queue close commands for all {trades.length} open position{trades.length !== 1 ? "s" : ""} via your broker.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCloseAllConfirm(false)}
                className="flex-1 rounded-lg border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-sidebar-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseAll}
                disabled={closeAllLoading}
                className="flex-1 rounded-lg bg-destructive py-3 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {closeAllLoading ? "Closing..." : "Close All"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
