import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import API from "@/services/api";

export default function PnLTicker() {
  const [todayPnl, setTodayPnl] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const fetch = async () => {
      try {
        const res = await API.get("/trades?limit=200");
        const trades = res.data || [];
        const today = new Date().toDateString();
        const pnl = trades
          .filter((t) => new Date(t.updatedAt || t.createdAt).toDateString() === today)
          .reduce((sum, t) => sum + (t.pnl || 0), 0);
        if (mounted.current) setTodayPnl(pnl);
      } catch {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  if (todayPnl === null) return null;

  const isPositive = todayPnl >= 0;

  return (
    <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold backdrop-blur-xl ${
      isPositive
        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
        : "border-red-500/20 bg-red-500/5 text-red-400"
    }`}>
      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span>{isPositive ? "+" : ""}${todayPnl.toFixed(2)}</span>
      <span className="text-[10px] opacity-60">today</span>
    </div>
  );
}
