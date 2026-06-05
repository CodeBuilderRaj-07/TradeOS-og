import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import { ArrowUpRight, ArrowDownRight, Search, Plus, ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import API from "@/services/api";
import { errorToast, successToast } from "@/services/toastService";
import { STATUS_COLORS, STATUS_LABELS, STATUS_OPTIONS } from "@/app/config/constants";
import JournalSkeleton from "@/components/skeletons/JournalSkeleton";

const PAGE_SIZE = 25;

function getStatusKey(status) {
  if (!status) return "open";
  const s = status.toLowerCase().replace(/\s+/g, "_");
  if (s in STATUS_COLORS) return s;
  if (s === "closed_win" || s === "win" || s === "closed win") return "closed_win";
  if (s === "closed_loss" || s === "loss" || s === "closed loss") return "closed_loss";
  if (s === "closed_be" || s === "be" || s === "closed be") return "closed_be";
  return "open";
}

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Journal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [directionFilter, setDirectionFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All Sessions");
  const [page, setPage] = useState(1);

  const fetchTrades = () => {
    setLoading(true);
    setLoadError(null);
    API.get("/trades?limit=200")
      .then((res) => setTrades(res.data || []))
      .catch(() => { setLoadError("Failed to load trades"); errorToast("Failed to load trades"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrades(); }, []);

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      const pair = (t.symbol || t.pair || "").toLowerCase();
      const notes = (t.notes || "").toLowerCase();
      const strategy = (t.strategy || "").toLowerCase();
      const q = search.toLowerCase();
      if (q && !pair.includes(q) && !notes.includes(q) && !strategy.includes(q)) return false;
      if (statusFilter !== "All Status") {
        const sk = getStatusKey(t.status);
        const sf = statusFilter.toLowerCase().replace(/\s+/g, "_");
        if (sk !== sf) return false;
      }
      if (directionFilter !== "All") {
        const dir = (t.tradeType || "").toLowerCase() === "buy" ? "long" : "short";
        if (dir !== directionFilter.toLowerCase()) return false;
      }
      if (sessionFilter !== "All Sessions") {
        if ((t.session || "").toLowerCase() !== sessionFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [trades, search, statusFilter, directionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, statusFilter, directionFilter, sessionFilter]);

  if (loading) return <JournalSkeleton />;

  if (loadError && trades.length === 0) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trade Journal</h1>
        <GlassPanel className="p-14 text-center">
          <h2 className="text-xl font-bold text-foreground">Failed to load trades</h2>
          <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          <button onClick={fetchTrades} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <RefreshCw size={16} /> Retry
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trade Journal</h1>
          <p className="text-sm text-muted-foreground mt-1">{trades.length} trade{trades.length !== 1 ? "s" : ""} logged</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchTrades} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors" title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button onClick={() => {
            if (trades.length === 0) return;
            const headers = ["symbol","tradeType","entryPrice","exitPrice","stopLoss","takeProfit","pnl","status","strategy","tags","session","notes","createdAt","updatedAt"];
            const rows = trades.map((t) => headers.map((h) => JSON.stringify(t[h] ?? "")).join(","));
            const csv = [headers.join(","), ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `trades-${new Date().toISOString().slice(0,10)}.csv`; a.click();
            URL.revokeObjectURL(url);
            successToast("Trades exported");
          }} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-card/80 transition-colors">
            <Download size={14} />
            Export
          </button>
          <button onClick={() => navigate("/new-trade")} className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            Log Trade
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-[220px] items-center gap-2 rounded-lg border border-border bg-card px-3">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by pair, notes, strategy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          value={directionFilter}
          onChange={(e) => setDirectionFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none"
        >
          <option>All</option>
          <option>Long</option>
          <option>Short</option>
        </select>
        <select
          value={sessionFilter}
          onChange={(e) => setSessionFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none"
        >
          <option>All Sessions</option>
          <option>Asian</option>
          <option>London</option>
          <option>New York</option>
          <option>Overlap</option>
        </select>
      </motion.div>

      <motion.div variants={staggerItem}>
        {trades.length === 0 ? (
        <GlassPanel className="p-14 text-center">
          <h2 className="text-2xl font-bold text-foreground">No trades yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Log your first trade to get started.</p>
          <button
            onClick={() => navigate("/new-trade")}
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Log Your First Trade
          </button>
        </GlassPanel>
      ) : filtered.length === 0 ? (
        <GlassPanel className="p-14 text-center">
          <h2 className="text-xl font-bold text-foreground">No trades match your filters</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-2">
          {paginated.map((trade, i) => {
            const isLong = trade.tradeType === "BUY";
            const sk = getStatusKey(trade.status);
            const pnl = trade.pnl;
            const isOpen = ["open", "tp_touched", "sl_touched", "be_touched"].includes(sk);
            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                <button
                  onClick={() => navigate(`/trade/${trade.id}`)}
                  className="glass rounded-xl p-4 w-full text-left hover:border-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isLong ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                      {isLong ? (
                        <ArrowUpRight size={16} className="text-emerald-400" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{trade.symbol || trade.pair || "—"}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${STATUS_COLORS[sk] || STATUS_COLORS.open}`}>
                          {STATUS_LABELS[sk] || trade.status || "Open"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">{formatDate(trade.createdAt)}</span>
                        {trade.strategy && (
                          <span className="text-xs text-primary">{trade.strategy}</span>
                        )}
                        {trade.session && (
                          <span className="text-xs text-muted-foreground capitalize">{trade.session.replace(/_/g, " ")}</span>
                        )}
                        {trade.tags?.length > 0 && (
                          <span className="flex gap-1">
                            {trade.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{tag}</span>
                            ))}
                            {trade.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{trade.tags.length - 3}</span>}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-mono font-bold ${isOpen ? "text-blue-400" : pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {isOpen ? "Running" : `${pnl >= 0 ? "+" : ""}$${(pnl || 0).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
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
    </motion.div>
    </motion.div>
  );
}
