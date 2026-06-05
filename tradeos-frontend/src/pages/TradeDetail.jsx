import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import { ArrowLeft, TrendingUp, TrendingDown, Trash2, X, Edit3, Check, RefreshCw } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import API from "@/services/api";
import { successToast, errorToast } from "@/services/toastService";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { STATUS_COLORS, STATUS_LABELS } from "@/app/config/constants";
import TradeSkeleton from "@/components/skeletons/TradeSkeleton";

const EMOTIONS = ["Calm", "Confident", "Anxious", "Greedy", "Fearful", "Excited", "Frustrated", "Revenge", "FOMO", "Disciplined"];
const MISTAKES = ["Moved SL", "No SL", "Oversize", "FOMO entry", "Revenge trade", "Ignored plan", "Early exit", "Late entry", "News trade"];

function getStatusKey(s) {
  if (!s) return "OPEN";
  const k = s.toUpperCase();
  return k in STATUS_COLORS ? k : "OPEN";
}

export default function TradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClose, setShowClose] = useState(false);
  const [closePrice, setClosePrice] = useState("");
  const [closing, setClosing] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedMistakes, setSelectedMistakes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchTrade = () => {
    setLoading(true);
    setError(null);
    API.get(`/trades/${id}`)
      .then((res) => {
        if (res.data) {
          setTrade(res.data);
        } else {
          setError("Trade not found");
        }
      })
      .catch((err) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || "";
        if (status === 404) {
          setError("Trade not found");
        } else {
          setError("Failed to load trade details" + (msg ? ": " + msg : ""));
          errorToast("Failed to load trade details" + (msg ? ": " + msg : ""));
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrade(); }, [id]);

  const startEditing = () => {
    setEditData({
      symbol: trade.symbol || "",
      tradeType: trade.tradeType || "",
      entryPrice: trade.entryPrice || "",
      exitPrice: trade.exitPrice || "",
      stopLoss: trade.stopLoss || "",
      takeProfit: trade.takeProfit || "",
      positionSize: trade.positionSize || trade.lotSize || "",
      notes: trade.notes || "",
      strategy: trade.strategy || "",
      session: trade.session || "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...editData,
        entryPrice: Number(editData.entryPrice),
        exitPrice: editData.exitPrice ? Number(editData.exitPrice) : undefined,
        stopLoss: editData.stopLoss ? Number(editData.stopLoss) : undefined,
        takeProfit: editData.takeProfit ? Number(editData.takeProfit) : undefined,
        positionSize: editData.positionSize ? Number(editData.positionSize) : undefined,
      };
      await API.put(`/trades/${id}`, payload);
      successToast("Trade updated");
      setEditing(false);
      fetchTrade();
    } catch {
      errorToast("Failed to update trade");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/trades/${id}`);
      successToast("Trade deleted");
      navigate(-1);
    } catch {
      errorToast("Failed to delete trade");
    }
  };

  const handleClose = async () => {
    if (!closePrice) return;
    const prev = trade;
    setTrade((t) => t ? { ...t, status: "manual_close", exitPrice: closePrice } : t);
    setShowClose(false);
    try {
      await API.put(`/trades/${id}/close`, {
        exitPrice: Number(closePrice),
        emotions: selectedEmotions,
        mistakes: selectedMistakes,
      });
      successToast("Trade closed");
      fetchTrade();
    } catch {
      setTrade(prev);
      errorToast("Failed to close trade");
    }
  };

  if (loading) return <TradeSkeleton />;

  if (error && !trade) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Trade Not Found</h1>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
        <GlassPanel className="p-14 text-center">
          <button
            onClick={fetchTrade}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </GlassPanel>
      </div>
    );
  }

  if (!trade) return null;

  const isProfit = (trade.pnl || 0) >= 0;
  const sk = getStatusKey(trade.status);
  const isOpen = sk === "OPEN";

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{trade.symbol || "—"}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${STATUS_COLORS[sk] || STATUS_COLORS.open}`}>
                {STATUS_LABELS[sk] || trade.status || "Open"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground capitalize">
              {trade.tradeType} · {trade.createdAt ? new Date(trade.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button onClick={() => setShowClose(true)} className="h-10 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Close Trade
            </button>
          )}
          {editing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button onClick={startEditing} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary transition-colors">
              <Edit3 size={16} />
            </button>
          )}
          <button onClick={() => setShowDeleteConfirm(true)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-red-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>

      {/* Status Alerts */}
      <motion.div variants={staggerItem}>
        {isOpen && (
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400">
            Trade is still active. Manage your position or close it.
          </div>
        )}
      </motion.div>

      {/* Main Grid */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.8fr] gap-4">
        {/* Left - Details */}
        <GlassPanel className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Trade Details</h3>
          {editing ? (
            <div className="grid grid-cols-2 gap-3">
              <EditField label="Symbol" value={editData.symbol} onChange={(v) => setEditData({ ...editData, symbol: v })} />
              <EditField label="Direction" value={editData.tradeType} onChange={(v) => setEditData({ ...editData, tradeType: v })} />
              <EditField label="Entry Price" value={editData.entryPrice} onChange={(v) => setEditData({ ...editData, entryPrice: v })} type="number" />
              <EditField label="Exit Price" value={editData.exitPrice} onChange={(v) => setEditData({ ...editData, exitPrice: v })} type="number" />
              <EditField label="Stop Loss" value={editData.stopLoss} onChange={(v) => setEditData({ ...editData, stopLoss: v })} type="number" />
              <EditField label="Take Profit" value={editData.takeProfit} onChange={(v) => setEditData({ ...editData, takeProfit: v })} type="number" />
              <EditField label="Position Size" value={editData.positionSize} onChange={(v) => setEditData({ ...editData, positionSize: v })} type="number" />
              <EditField label="Strategy" value={editData.strategy} onChange={(v) => setEditData({ ...editData, strategy: v })} />
              <EditField label="Session" value={editData.session} onChange={(v) => setEditData({ ...editData, session: v })} />
              <div className="col-span-2">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30 resize-none"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <DetailRow label="Entry" value={`$${trade.entryPrice}`} />
                <DetailRow label="Exit" value={trade.exitPrice ? `$${trade.exitPrice}` : "—"} />
                <DetailRow label="Stop Loss" value={trade.stopLoss ? `$${trade.stopLoss}` : "—"} red />
                <DetailRow label="Take Profit" value={trade.takeProfit ? `$${trade.takeProfit}` : "—"} green />
                <DetailRow label="Lot Size" value={trade.positionSize || trade.lotSize || "—"} />
                <DetailRow label="R:R" value={trade.rrRatio ? `1:${trade.rrRatio}` : "—"} />
              </div>

              {trade.notes && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm text-foreground/80">{trade.notes}</p>
                </div>
              )}

              {trade.strategy && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Strategy:</span>
                  <span className="text-sm font-medium text-primary">{trade.strategy}</span>
                </div>
              )}

              {trade.session && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Session:</span>
                  <span className="text-sm font-medium text-foreground capitalize">{trade.session.replace(/_/g, " ")}</span>
                </div>
              )}
            </>
          )}
        </GlassPanel>

        {/* Right - Performance */}
        <div className="space-y-4">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-3">
              {isProfit ? <TrendingUp size={18} className="text-emerald-400" /> : <TrendingDown size={18} className="text-red-400" />}
              <h3 className="text-lg font-bold text-foreground">Performance</h3>
            </div>
            <h1 className={`mt-6 text-4xl font-bold tracking-tight font-mono ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
              {isProfit ? "+" : ""}${(trade.pnl || 0).toFixed(2)}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Realized profit & loss</p>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Trade"
        message="Delete this trade permanently? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Close Trade Dialog */}
      <AnimatePresence>
        {showClose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Close Trade</h2>
                <button onClick={() => setShowClose(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Exit Price</label>
                  <input
                    type="number"
                    step="any"
                    value={closePrice}
                    onChange={(e) => setClosePrice(e.target.value)}
                    placeholder="0.00"
                    className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 font-mono text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Emotions</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setSelectedEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e])}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedEmotions.includes(e)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mistakes</label>
                  <div className="flex flex-wrap gap-2">
                    {MISTAKES.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMistakes((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedMistakes.includes(m)
                            ? "border-red-500 bg-red-500/10 text-red-400"
                            : "border-border text-muted-foreground hover:border-red-500/30"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  disabled={closing || !closePrice}
                  className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {closing ? "Closing..." : "Confirm Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailRow({ label, value, red, green }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm font-mono font-medium ${red ? "text-red-400" : green ? "text-emerald-400" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function EditField({ label, value, onChange, type }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-border bg-background/70 px-3 text-sm text-foreground outline-none focus:border-primary/30"
      />
    </div>
  );
}
