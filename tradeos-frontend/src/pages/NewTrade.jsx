import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import { Zap } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { useTradeExecution } from "@/hooks/useTradeExecution";

export default function NewTrade() {
  const {
    loading,
    fetchingPrice,
    message,
    errors,
    formData,
    handleChange,
    handleSubmit,
    setDirection,
    fetchMarketPrice,
    riskAmount,
    rewardAmount,
    rrRatio,
    slPips,
    tpPips,
    PAIRS,
    SESSIONS,
    TIMEFRAMES,
  } = useTradeExecution();

  const isLong = formData.direction === "long";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-6"
    >
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Log New Trade</h1>
        <p className="text-sm text-muted-foreground mt-1">Main Account</p>
      </motion.div>

      {message && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}

      <GlassPanel className="p-6 space-y-6">
        {/* Direction Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDirection("long")}
            className={`flex-1 rounded-lg border-2 py-3 text-sm font-bold transition-all ${
              isLong
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-border text-muted-foreground hover:border-emerald-500/30"
            }`}
          >
            LONG
          </button>
          <button
            type="button"
            onClick={() => setDirection("short")}
            className={`flex-1 rounded-lg border-2 py-3 text-sm font-bold transition-all ${
              !isLong
                ? "border-red-500 bg-red-500/10 text-red-400"
                : "border-border text-muted-foreground hover:border-red-500/30"
            }`}
          >
            SHORT
          </button>
        </div>

        {/* Pair + Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pair / Asset</label>
            <select
              name="pair"
              value={formData.pair}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30"
            >
              <option value="">Select pair</option>
              {PAIRS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Entry Price</label>
            <div className="flex gap-2">
              <input
                name="entryPrice"
                type="number"
                step="any"
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="h-12 flex-1 rounded-lg border border-border bg-background/70 px-4 font-mono text-sm text-foreground outline-none focus:border-primary/30"
              />
              <button
                type="button"
                onClick={fetchMarketPrice}
                disabled={fetchingPrice || !formData.pair}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-40"
                title="Fetch market price"
              >
                {fetchingPrice ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Stop Loss
              {slPips > 0 && (
                <span className={`ml-2 font-mono text-[10px] ${slPips >= 50 ? "text-emerald-400" : "text-red-400"}`}>
                  ({Math.round(slPips)} pips)
                </span>
              )}
            </label>
            <input
              name="stopLoss"
              type="number"
              step="any"
              value={formData.stopLoss}
              onChange={handleChange}
              placeholder="0.00"
              className={`h-12 w-full rounded-lg border bg-background/70 px-4 font-mono text-sm outline-none focus:border-primary/30 ${
                errors.stopLoss ? "border-red-500 text-red-400" : "border-border text-red-400"
              }`}
            />
            {errors.stopLoss && (
              <p className="mt-1 text-[11px] text-red-400">{errors.stopLoss}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Take Profit
              {tpPips > 0 && (
                <span className={`ml-2 font-mono text-[10px] ${tpPips >= 150 ? "text-emerald-400" : "text-red-400"}`}>
                  ({Math.round(tpPips)} pips)
                </span>
              )}
            </label>
            <input
              name="takeProfit"
              type="number"
              step="any"
              value={formData.takeProfit}
              onChange={handleChange}
              placeholder="0.00"
              className={`h-12 w-full rounded-lg border bg-background/70 px-4 font-mono text-sm outline-none focus:border-primary/30 ${
                errors.takeProfit ? "border-red-500 text-red-400" : "border-border text-emerald-400"
              }`}
            />
            {errors.takeProfit && (
              <p className="mt-1 text-[11px] text-red-400">{errors.takeProfit}</p>
            )}
          </div>
        </div>

        {/* R:R Badge */}
        {riskAmount > 0 && rewardAmount > 0 && (
          <div className="flex items-center justify-center">
            <div className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary">
              R:R 1 : {rrRatio}
            </div>
          </div>
        )}

        {/* Lot Size + Risk % */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Lot Size</label>
            <input
              name="lotSize"
              type="number"
              step="any"
              value={formData.lotSize}
              onChange={handleChange}
              placeholder="0.10"
              className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 font-mono text-sm text-foreground outline-none focus:border-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Risk % <span className="text-foreground font-mono">{formData.riskPct}%</span>
            </label>
            <input
              name="riskPct"
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={formData.riskPct}
              onChange={handleChange}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
            />
          </div>
        </div>

        {/* Session + Strategy + Timeframe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Session</label>
            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30"
            >
              {SESSIONS.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Strategy</label>
            <input
              name="strategy"
              value={formData.strategy}
              onChange={handleChange}
              placeholder="e.g. Breakout"
              className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeframe</label>
            <select
              name="timeframe"
              value={formData.timeframe}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Confidence Slider */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Confidence <span className="text-foreground font-mono">{formData.confidence}/10</span>
          </label>
          <input
            name="confidence"
            type="range"
            min="1"
            max="10"
            value={formData.confidence}
            onChange={handleChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Trade rationale, observations..."
            rows={3}
            className="min-h-[80px] w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/30 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !formData.pair || !formData.entryPrice}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Zap size={16} />
          )}
          {loading ? "Logging Trade..." : "Log Trade"}
        </button>
      </GlassPanel>
    </motion.div>
  );
}
