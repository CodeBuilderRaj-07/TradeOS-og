export const APP_NAME = "TradeOS";
export const APP_DESCRIPTION = "Professional Trading Workspace";
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws/market";

export const TRADE_TYPES = {
  BUY: "BUY",
  SELL: "SELL",
};

export const ROLES = {
  ADMIN: "ADMIN",
  TRADER: "TRADER",
  ANALYST: "ANALYST",
};

export const PNL_COLORS = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export const STATUS_COLORS = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  tp_touched: "bg-emerald-500/30 text-emerald-300 border-emerald-400/30",
  sl_touched: "bg-red-500/30 text-red-300 border-red-400/30",
  be_touched: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  closed_win: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  closed_loss: "bg-red-500/20 text-red-400 border-red-500/20",
  closed_be: "bg-gray-500/20 text-gray-400 border-gray-500/20",
  tp_hit: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  sl_hit: "bg-red-500/20 text-red-400 border-red-500/20",
  manual_close: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  breakeven: "bg-gray-500/20 text-gray-400 border-gray-500/20",
};

export const STATUS_LABELS = {
  open: "Open", tp_touched: "TP Touched", sl_touched: "SL Touched", be_touched: "BE Touched",
  closed_win: "Closed Win", closed_loss: "Closed Loss", closed_be: "Closed BE",
  tp_hit: "TP Hit", sl_hit: "SL Hit", manual_close: "Manual Close", breakeven: "Breakeven",
};

export const STATUS_OPTIONS = [
  "All Status", "Open", "Closed Win", "Closed Loss", "Closed BE",
  "TP Touched", "SL Touched", "TP Hit", "SL Hit", "Manual Close", "Breakeven",
];
