import { useState } from "react";

import API from "@/services/api";

import { successToast, errorToast } from "@/services/toastService";

const PAIRS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD",
  "EURGBP", "EURJPY", "GBPJPY",
  "XAUUSD", "XAGUSD", "USOIL", "UKOIL",
  "BTCUSD", "ETHUSD", "BNBUSD", "SOLUSD", "XRPUSD",
];

const SESSIONS = ["asian", "london", "new_york", "overlap"];
const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"];

const PIP_VALUES = {
  EURUSD: 0.0001, GBPUSD: 0.0001, USDJPY: 0.01, USDCHF: 0.0001,
  AUDUSD: 0.0001, NZDUSD: 0.0001, USDCAD: 0.0001,
  EURGBP: 0.0001, EURJPY: 0.01, GBPJPY: 0.01,
  XAUUSD: 0.1, XAGUSD: 0.01,
  USOIL: 0.1, UKOIL: 0.1,
  BTCUSD: 1.0, ETHUSD: 0.1, BNBUSD: 0.1, SOLUSD: 0.1, XRPUSD: 0.001,
};

const DECIMALS = {
  EURUSD: 4, GBPUSD: 4, USDJPY: 3, USDCHF: 4,
  AUDUSD: 4, NZDUSD: 4, USDCAD: 4,
  EURGBP: 4, EURJPY: 3, GBPJPY: 3,
  XAUUSD: 3, XAGUSD: 3,
  USOIL: 3, UKOIL: 3,
  BTCUSD: 2, ETHUSD: 3, BNBUSD: 3, SOLUSD: 3, XRPUSD: 4,
};

const MIN_SL_PIPS = 5;
const MIN_TP_PIPS = 10;

function getPipValue(pair) {
  return PIP_VALUES[pair] || 0.0001;
}

function getDecimals(pair) {
  return DECIMALS[pair] || 4;
}

function formatPrice(price, pair) {
  const d = getDecimals(pair);
  return Number(price).toFixed(d);
}

function pipsBetween(price1, price2, pair) {
  const pip = getPipValue(pair);
  if (!pip || !price1 || !price2) return 0;
  return Math.abs(price1 - price2) / pip;
}

export function useTradeExecution() {
  const [loading, setLoading] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    direction: "long",
    pair: "",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    lotSize: "",
    riskPct: 1,
    session: "london",
    strategy: "",
    timeframe: "H1",
    confidence: 7,
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const setDirection = (dir) => {
    setFormData({ ...formData, direction: dir });
  };

  const entry = Number(formData.entryPrice) || 0;
  const sl = Number(formData.stopLoss) || 0;
  const tp = Number(formData.takeProfit) || 0;
  const riskAmount = Math.abs(entry - sl);
  const rewardAmount = Math.abs(tp - entry);
  const rrRatio = riskAmount > 0 ? (rewardAmount / riskAmount).toFixed(2) : "0";

  const slPips = formData.pair && sl && entry ? pipsBetween(entry, sl, formData.pair) : 0;
  const tpPips = formData.pair && tp && entry ? pipsBetween(entry, tp, formData.pair) : 0;

  const fetchMarketPrice = async () => {
    if (!formData.pair) {
      errorToast("Select a pair first");
      return;
    }
    try {
      setFetchingPrice(true);
      const res = await API.get(`/market/price/${formData.pair}`);
      const price = res.data?.price;
      if (price) {
        setFormData((prev) => ({ ...prev, entryPrice: formatPrice(price, formData.pair) }));
        successToast(`Market price fetched: ${formatPrice(price, formData.pair)}`);
      } else {
        errorToast(res.data?.error || "Could not fetch price");
      }
    } catch {
      errorToast("Failed to fetch market price");
    } finally {
      setFetchingPrice(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.pair) errs.pair = "Select a pair";
    if (!formData.entryPrice) errs.entryPrice = "Entry price is required";
    const pip = getPipValue(formData.pair);

    if (sl && entry && pip) {
      const slInPips = pipsBetween(entry, sl, formData.pair);
      if (slInPips < MIN_SL_PIPS) {
        errs.stopLoss = `SL must be at least ${MIN_SL_PIPS} pips (currently ${Math.round(slInPips)} pips)`;
      }
    }

    if (tp && entry && pip) {
      const tpInPips = pipsBetween(entry, tp, formData.pair);
      if (tpInPips < MIN_TP_PIPS) {
        errs.takeProfit = `TP must be at least ${MIN_TP_PIPS} pips (currently ${Math.round(tpInPips)} pips)`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      errorToast("Fix validation errors before submitting");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        symbol: formData.pair,
        direction: formData.direction,
        tradeType: formData.direction === "long" ? "BUY" : "SELL",
        entryPrice: entry,
        stopLoss: sl,
        takeProfit: tp,
        positionSize: Number(formData.lotSize) || 0,
        riskPct: Number(formData.riskPct) || 1,
        session: formData.session,
        strategy: formData.strategy,
        timeframe: formData.timeframe,
        confidence: String(formData.confidence || "7"),
        notes: formData.notes,
      };

      const response = await API.post("/trades", payload);
      successToast(response.data || "Trade Created");

      setMessage("Trade executed successfully");
      setFormData({
        direction: "long",
        pair: "",
        entryPrice: "",
        stopLoss: "",
        takeProfit: "",
        lotSize: "",
        riskPct: 1,
        session: "london",
        strategy: "",
        timeframe: "H1",
        confidence: 7,
        notes: "",
      });
      setErrors({});
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Failed to execute trade";
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
