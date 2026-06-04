export const ALL_PAIRS = [
  { label: "BTC/USDT", value: "BTCUSDT", stream: "btcusdt", category: "Crypto", binance: true },
  { label: "ETH/USDT", value: "ETHUSDT", stream: "ethusdt", category: "Crypto", binance: true },
  { label: "BNB/USDT", value: "BNBUSDT", stream: "bnbusdt", category: "Crypto", binance: true },
  { label: "SOL/USDT", value: "SOLUSDT", stream: "solusdt", category: "Crypto", binance: true },
  { label: "XRP/USDT", value: "XRPUSDT", stream: "xrpusdt", category: "Crypto", binance: true },
  { label: "DOGE/USDT", value: "DOGEUSDT", stream: "dogeusdt", category: "Crypto", binance: true },
  { label: "ADA/USDT", value: "ADAUSDT", stream: "adausdt", category: "Crypto", binance: true },
  { label: "DOT/USDT", value: "DOTUSDT", stream: "dotusdt", category: "Crypto", binance: true },
  { label: "LINK/USDT", value: "LINKUSDT", stream: "linkusdt", category: "Crypto", binance: true },
  { label: "AVAX/USDT", value: "AVAXUSDT", stream: "avaxusdt", category: "Crypto", binance: true },
  { label: "MATIC/USDT", value: "MATICUSDT", stream: "maticusdt", category: "Crypto", binance: true },
  { label: "ATOM/USDT", value: "ATOMUSDT", stream: "atomusdt", category: "Crypto", binance: true },
  { label: "LTC/USDT", value: "LTCUSDT", stream: "ltcusdt", category: "Crypto", binance: true },
  { label: "BCH/USDT", value: "BCHUSDT", stream: "bchusdt", category: "Crypto", binance: true },
  { label: "XLM/USDT", value: "XLMUSDT", stream: "xlmusdt", category: "Crypto", binance: true },
  { label: "XAU/USD", value: "XAUUSD", stream: null, category: "Metals", binance: false },
  { label: "XAG/USD", value: "XAGUSD", stream: null, category: "Metals", binance: false },
  { label: "USOIL", value: "USOIL", stream: null, category: "Commodities", binance: false },
  { label: "UKOIL", value: "UKOIL", stream: null, category: "Commodities", binance: false },
  { label: "EUR/USD", value: "EURUSD", stream: null, category: "Forex", binance: false },
  { label: "GBP/USD", value: "GBPUSD", stream: null, category: "Forex", binance: false },
  { label: "USD/JPY", value: "USDJPY", stream: null, category: "Forex", binance: false },
  { label: "USD/CHF", value: "USDCHF", stream: null, category: "Forex", binance: false },
  { label: "AUD/USD", value: "AUDUSD", stream: null, category: "Forex", binance: false },
  { label: "NZD/USD", value: "NZDUSD", stream: null, category: "Forex", binance: false },
  { label: "USD/CAD", value: "USDCAD", stream: null, category: "Forex", binance: false },
  { label: "EUR/GBP", value: "EURGBP", stream: null, category: "Forex", binance: false },
  { label: "EUR/JPY", value: "EURJPY", stream: null, category: "Forex", binance: false },
  { label: "GBP/JPY", value: "GBPJPY", stream: null, category: "Forex", binance: false },
];

export const FAVORITES_STORAGE_KEY = "tradeos_favorite_pairs";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ["BTCUSDT", "ETHUSDT"];
  } catch {
    return ["BTCUSDT", "ETHUSDT"];
  }
}

export function saveFavorites(values) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(values));
}

export function getPairConfig(value) {
  return ALL_PAIRS.find((p) => p.value === value);
}
