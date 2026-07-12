import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/stagger"
import { useNavigate, useParams } from "react-router-dom";
import { Bot, ArrowLeft, Save, Play, TrendingUp, TrendingDown, Zap, DollarSign, Activity, BarChart3 } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import API from "@/services/api";
import { successToast, errorToast } from "@/services/toastService";

const PAIRS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD",
  "USDCAD", "EURGBP", "EURJPY", "GBPJPY",
  "XAUUSD", "XAGUSD", "USOIL", "UKOIL",
  "BTCUSD", "ETHUSD", "BNBUSD", "SOLUSD", "XRPUSD",
];

const TRIGGERS = [
  { value: "IMMEDIATE", label: "Immediate", desc: "Execute as soon as the algo starts" },
  { value: "PRICE_ABOVE", label: "Price Above", desc: "Execute when price rises above threshold" },
  { value: "PRICE_BELOW", label: "Price Below", desc: "Execute when price drops below threshold" },
];

export default function AlgoBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    symbol: "BTCUSD",
    tradeDirection: "BUY",
    entryTrigger: "IMMEDIATE",
    entryValue: "",
    stopLoss: "",
    takeProfit: "",
    positionSize: "0.1",
    maxActiveTrades: 1,
    maxDailyLoss: "",
    tradingAccountId: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [accRes, ...rest] = await Promise.all([
          API.get("/trading-accounts"),
          ...(isEditing ? [API.get(`/algo-strategies/${id}`)] : []),
        ]);
        setAccounts(accRes.data || []);

        if (isEditing && rest[0]) {
          const algo = rest[0].data;
          if (algo) {
            setFormData({
              name: algo.name || "",
              description: algo.description || "",
              symbol: algo.symbol || "BTCUSD",
              tradeDirection: algo.tradeDirection || "BUY",
              entryTrigger: algo.entryTrigger || "IMMEDIATE",
              entryValue: algo.entryValue || "",
              stopLoss: algo.stopLoss || "",
              takeProfit: algo.takeProfit || "",
              positionSize: algo.positionSize || "0.1",
              maxActiveTrades: algo.maxActiveTrades || 1,
              maxDailyLoss: algo.maxDailyLoss || "",
              tradingAccountId: algo.tradingAccountId || "",
            });
          }
        }
      } catch {
        errorToast("Failed to load algo data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.symbol) errors.symbol = "Select a symbol";
    if (!formData.tradingAccountId) errors.tradingAccountId = "Select a trading account";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (andStart) => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...formData,
        entryValue: Number(formData.entryValue) || 0,
        stopLoss: Number(formData.stopLoss) || 0,
        takeProfit: Number(formData.takeProfit) || 0,
        positionSize: Number(formData.positionSize) || 0.1,
        maxActiveTrades: Number(formData.maxActiveTrades) || 1,
        maxDailyLoss: Number(formData.maxDailyLoss) || 0,
        tradingAccountId: formData.tradingAccountId ? Number(formData.tradingAccountId) : null,
      };

      if (isEditing) {
        await API.put(`/algo-strategies/${id}`, payload);
        if (andStart) {
          await API.put(`/algo-strategies/${id}/toggle`, { active: true });
        }
        successToast("Algo updated");
      } else {
        const res = await API.post("/algo-strategies", payload);
        if (andStart && res.data?.id) {
          await API.put(`/algo-strategies/${res.data.id}/toggle`, { active: true });
        }
        successToast("Algo created");
      }
      navigate("/algo-trading");
    } catch {
      errorToast("Failed to save algo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[900px] mx-auto">
        <div className="flex items-center gap-4">
          <div className="skeleton h-10 w-10 rounded-lg" />
          <div>
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="skeleton mt-2 h-4 w-56 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <div className="space-y-5">
            <div className="glass p-6"><div className="skeleton h-48 w-full rounded-lg" /></div>
            <div className="glass p-6"><div className="skeleton h-32 w-full rounded-lg" /></div>
            <div className="glass p-6"><div className="skeleton h-40 w-full rounded-lg" /></div>
          </div>
          <div className="space-y-5">
            <div className="glass p-6"><div className="skeleton h-36 w-full rounded-lg" /></div>
            <div className="glass p-6"><div className="skeleton h-32 w-full rounded-lg" /></div>
          </div>
        </div>
      </div>
    );
  }

  const showPriceField = formData.entryTrigger === "PRICE_ABOVE" || formData.entryTrigger === "PRICE_BELOW";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[900px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center gap-4">
        <button
          onClick={() => navigate("/algo-trading")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {isEditing ? "Edit Algo" : "New Algo Strategy"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing ? "Modify your automated trading strategy" : "Build an automated trading strategy"}
          </p>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Form */}
        <div className="space-y-5">
          {/* Identity */}
          <GlassPanel className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Bot size={16} className="text-purple-400" />
              Strategy Identity
            </h3>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
              <input
                value={formData.name}
                onChange={(e) => { handleChange("name", e.target.value); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }}
                placeholder="e.g. BTC Momentum Breaker"
                className={`h-12 w-full rounded-lg border ${formErrors.name ? "border-red-500/50" : "border-border"} bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30`}
              />
              {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="What does this algo do?"
                rows={2}
                className="min-h-[60px] w-full rounded-lg border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/30 resize-none"
              />
            </div>
          </GlassPanel>

          {/* Market */}
          <GlassPanel className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-400" />
              Market & Direction
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Symbol / Pair</label>
                <select
                  value={formData.symbol}
                  onChange={(e) => { handleChange("symbol", e.target.value); if (formErrors.symbol) setFormErrors({ ...formErrors, symbol: "" }); }}
                  className={`h-12 w-full rounded-lg border ${formErrors.symbol ? "border-red-500/50" : "border-border"} bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30`}
                >
                  {PAIRS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Direction</label>
                <div className="flex h-12 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange("tradeDirection", "BUY")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-all ${
                      formData.tradeDirection === "BUY"
                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                        : "border-border bg-background/70 text-muted-foreground"
                    }`}
                  >
                    <TrendingUp size={16} />
                    Long
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("tradeDirection", "SELL")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-all ${
                      formData.tradeDirection === "SELL"
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-border bg-background/70 text-muted-foreground"
                    }`}
                  >
                    <TrendingDown size={16} />
                    Short
                  </button>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Entry Conditions */}
          <GlassPanel className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              Entry Conditions
            </h3>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Trigger Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TRIGGERS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleChange("entryTrigger", t.value)}
                    className={`text-left p-3 rounded-lg border text-sm transition-all ${
                      formData.entryTrigger === t.value
                        ? "border-primary/40 bg-primary/5 text-foreground"
                        : "border-border bg-background/50 text-muted-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="font-semibold">{t.label}</span>
                    <p className="text-[10px] mt-0.5 opacity-70">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {showPriceField && (
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {formData.entryTrigger === "PRICE_ABOVE" ? "Entry Above Price" : "Entry Below Price"}
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.entryValue}
                    onChange={(e) => handleChange("entryValue", e.target.value)}
                    placeholder="e.g. 50000"
                    className="h-12 w-full rounded-lg border border-border bg-background/70 pl-10 pr-4 text-sm font-mono text-foreground outline-none focus:border-primary/30"
                  />
                </div>
              </div>
            )}
          </GlassPanel>

          {/* Risk Parameters */}
          <GlassPanel className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              Risk Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Stop Loss</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stopLoss}
                  onChange={(e) => handleChange("stopLoss", e.target.value)}
                  placeholder="e.g. 48000"
                  className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm font-mono text-foreground outline-none focus:border-primary/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Take Profit</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.takeProfit}
                  onChange={(e) => handleChange("takeProfit", e.target.value)}
                  placeholder="e.g. 52000"
                  className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm font-mono text-foreground outline-none focus:border-primary/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Position Size (lots)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.positionSize}
                  onChange={(e) => handleChange("positionSize", e.target.value)}
                  className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm font-mono text-foreground outline-none focus:border-primary/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Max Active Trades</label>
                <input
                  type="number"
                  min={1}
                  value={formData.maxActiveTrades}
                  onChange={(e) => handleChange("maxActiveTrades", e.target.value)}
                  className="h-12 w-full rounded-lg border border-border bg-background/70 px-4 text-sm font-mono text-foreground outline-none focus:border-primary/30"
                />
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Account */}
          <GlassPanel className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              Trading Account
            </h3>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Connected Account</label>
              <select
                value={formData.tradingAccountId}
                onChange={(e) => { handleChange("tradingAccountId", e.target.value); if (formErrors.tradingAccountId) setFormErrors({ ...formErrors, tradingAccountId: "" }); }}
                className={`h-12 w-full rounded-lg border ${formErrors.tradingAccountId ? "border-red-500/50" : "border-border"} bg-background/70 px-4 text-sm text-foreground outline-none focus:border-primary/30`}
              >
                <option value="">Select account...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.broker})
                  </option>
                ))}
              </select>
              {formErrors.tradingAccountId && <p className="mt-1 text-xs text-red-400">{formErrors.tradingAccountId}</p>}
            </div>
            {accounts.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No accounts connected.{" "}
                <button onClick={() => navigate("/settings")} className="text-primary hover:underline">
                  Add one in Settings
                </button>
              </p>
            )}
          </GlassPanel>

          {/* Summary */}
          <GlassPanel className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Strategy</span>
                <span className="font-semibold text-foreground">{formData.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symbol</span>
                <span className="font-mono font-semibold text-foreground">{formData.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Direction</span>
                <span className={`font-semibold ${formData.tradeDirection === "BUY" ? "text-green-400" : "text-red-400"}`}>
                  {formData.tradeDirection}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trigger</span>
                <span className="text-foreground">{TRIGGERS.find((t) => t.value === formData.entryTrigger)?.label || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-mono text-foreground">{formData.positionSize} lots</span>
              </div>
            </div>
          </GlassPanel>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !formData.name}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Strategy"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !formData.name}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-sm font-semibold text-white hover:from-green-500 hover:to-emerald-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              <Play size={16} />
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {saving ? "Saving..." : "Save & Start Algo"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
