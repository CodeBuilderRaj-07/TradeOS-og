import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";
import { connectMarketSocket, disconnectMarketSocket } from "@/services/marketSocket";
import { ALL_PAIRS, getFavorites, saveFavorites, getPairConfig } from "@/app/config/pairs";
import { RefreshCw, Plus, Star, Settings2 } from "lucide-react";
import FavoritePairs from "./FavoritePairs";

const INTERVALS = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
];

export default function MarketChart() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [pair, setPair] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [manageOpen, setManageOpen] = useState(false);

  const pairConfig = getPairConfig(pair);

  const refreshFavorites = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  const loadHistorical = async (symbol, i) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${i}&limit=200`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.map((k) => ({
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
      }));
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      const cfg = getPairConfig(pair);
      if (!cfg || !cfg.binance) {
        setLoading(false);
        return;
      }

      const { createChart, ColorType } = await import("lightweight-charts");

      if (!chartContainerRef.current || destroyed) return;

      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
      }

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#8b8fa3",
          fontSize: 11,
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.03)" },
          horzLines: { color: "rgba(255,255,255,0.03)" },
        },
        crosshair: {
          mode: 0,
          vertLine: { color: "rgba(59,130,246,0.4)", style: 2, width: 1, labelBackgroundColor: "#3b82f6" },
          horzLine: { color: "rgba(59,130,246,0.4)", style: 2, width: 1, labelBackgroundColor: "#3b82f6" },
        },
        rightPriceScale: {
          borderColor: "rgba(255,255,255,0.05)",
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: {
          borderColor: "rgba(255,255,255,0.05)",
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: { vertTouchDrag: true, pressedMouseMove: true, horzTouchDrag: true },
        handleScale: { axisPressedMouse: { time: true, price: true }, pinch: true, mouseWheel: true },
        width: chartContainerRef.current.clientWidth,
        height: 320,
      });

      chartRef.current = chart;
      const series = chart.addCandlestickSeries({
        upColor: "#34d399",
        downColor: "#f87171",
        borderUpColor: "#34d399",
        borderDownColor: "#f87171",
        wickUpColor: "#34d399",
        wickDownColor: "#f87171",
      });
      candleSeriesRef.current = series;

      const candles = await loadHistorical(pair, interval);
      if (destroyed) return;

      if (candles.length > 0) {
        series.setData(candles);
        chart.timeScale().fitContent();

        const last = candles[candles.length - 1];
        setPrice(last.close);
        const prev = candles.length > 1 ? candles[candles.length - 2].close : last.close;
        setPriceChange(((last.close - prev) / prev) * 100);
      }

      if (cfg.stream) {
        connectMarketSocket((candle) => {
          if (destroyed) return;
          series.update(candle);
          setPrice(candle.close);
        }, cfg.stream);
      }
    };

    init();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      destroyed = true;
      disconnectMarketSocket();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [pair, interval]);

  const showChart = pairConfig?.binance;
  const favoritePairs = favorites
    .map((v) => getPairConfig(v))
    .filter(Boolean)
    .filter((p) => p.binance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassPanel className="p-4">
        {/* Favorites tabs */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {favoritePairs.map((p) => (
            <button
              key={p.value}
              onClick={() => setPair(p.value)}
              className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold transition-all ${
                pair === p.value
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-sidebar-accent text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/80"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setManageOpen(true)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            title="Manage favorite pairs"
          >
            <Settings2 size={13} />
          </button>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {INTERVALS.map((i) => (
                <button
                  key={i.value}
                  onClick={() => setInterval(i.value)}
                  className={`h-7 px-2 rounded text-[10px] font-semibold transition-colors ${
                    interval === i.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {price && showChart && (
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-foreground">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {priceChange !== null && (
                  <span className={`ml-2 text-[11px] font-mono font-semibold ${priceChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                  </span>
                )}
              </div>
            )}
            {loading && showChart && <RefreshCw size={14} className="animate-spin text-muted-foreground" />}
          </div>
        </div>

        {/* Chart area */}
        {!showChart ? (
          <div className="flex items-center justify-center h-[320px] text-sm text-muted-foreground">
            <div className="text-center">
              <p className="mb-1 font-semibold text-foreground">{pairConfig?.label || pair}</p>
              <p>Live chart not available for this pair</p>
              <p className="text-[10px] mt-1">Switch to a crypto pair for real-time charting</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[320px] text-sm text-muted-foreground">
            <div className="text-center">
              <p>Failed to load chart</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full" />
        )}
      </GlassPanel>

      <AnimatePresence>
        {manageOpen && (
          <FavoritePairs
            onClose={() => setManageOpen(false)}
            onUpdate={refreshFavorites}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
