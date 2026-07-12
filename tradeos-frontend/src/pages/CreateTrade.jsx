import { useState } from "react";
import { TrendingUp, Loader2, Save } from "lucide-react";
import API from "@/services/api";
import GlassPanel from "@/components/ui/GlassPanel";
import { motion } from "framer-motion";
import { staggerItem, staggerContainer } from "@/animations/stagger";
import { successToast, errorToast } from "@/services/toastService";
import { validateTradeForm } from "@/utils/tradeValidation";


export default function CreateTrade() {
  const [formData, setFormData] = useState({
    symbol: "",
    tradeType: "BUY",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    pnl: "",
    status: "OPEN",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const createTrade = async () => {
    const { valid, errors: validationErrors } = validateTradeForm(formData);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      await API.post("/trades/create", {
        ...formData,
        entryPrice: Number(formData.entryPrice),
        stopLoss: Number(formData.stopLoss),
        takeProfit: Number(formData.takeProfit),
        pnl: Number(formData.pnl),
      });
      successToast("Trade created successfully");
      setFormData({
        symbol: "",
        tradeType: "BUY",
        entryPrice: "",
        stopLoss: "",
        takeProfit: "",
        pnl: "",
        status: "OPEN",
      });
      setErrors({});
    } catch (error) {
      errorToast(error?.response?.data?.message || "Failed to create trade");
    } finally {
      setLoading(false);
    }
  };

  const risk = Math.abs(formData.entryPrice - formData.stopLoss);
  const reward = Math.abs(formData.takeProfit - formData.entryPrice);
  const rr = risk > 0 ? (reward / risk).toFixed(2) : 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Create Trade
          </h1>
          <p className="text-sm text-muted-foreground">
            Execute and track your positions
          </p>
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassPanel className="p-6 max-w-[760px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="BTCUSD"
              error={errors.symbol}
            />
            <SelectField
              label="Trade Type"
              name="tradeType"
              value={formData.tradeType}
              onChange={handleChange}
            />
            <InputField
              label="Entry Price"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              placeholder="65000"
              error={errors.entryPrice}
            />
            <InputField
              label="Stop Loss"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleChange}
              placeholder="64000"
              error={errors.stopLoss}
            />
            <InputField
              label="Take Profit"
              name="takeProfit"
              value={formData.takeProfit}
              onChange={handleChange}
              placeholder="68000"
              error={errors.takeProfit}
            />
            <InputField
              label="Current PNL"
              name="pnl"
              value={formData.pnl}
              onChange={handleChange}
              placeholder="420"
              error={errors.pnl}
            />
          </div>

          <div className="mt-5 rounded-lg border border-border bg-background/80 p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <TrendingUp size={18} className="text-success" />
              <h3 className="text-base font-bold text-foreground">
                Risk Analysis
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MetricItem title="Risk" value={risk} />
              <MetricItem title="Reward" value={reward} />
              <MetricItem title="R:R Ratio" value={`1:${rr}`} green />
            </div>
          </div>

          <button
            onClick={createTrade}
            disabled={loading}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Creating Trade..." : "Create Trade"}
          </button>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, error, ...props }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <input
        {...props}
        className={`h-12 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground ${
          error ? "border-red-500/50 focus:border-red-500" : "border-border focus:border-primary/30"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SelectField({ label, ...props }) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <select
        {...props}
        className="h-12 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-all focus:border-primary/30"
      >
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
    </div>
  );
}

function MetricItem({ title, value, green }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <h2
        className={`mt-2 text-2xl font-bold ${green ? "text-success" : "text-foreground"}`}
      >
        {value}
      </h2>
    </div>
  );
}
