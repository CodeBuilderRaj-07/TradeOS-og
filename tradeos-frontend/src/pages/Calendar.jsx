import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import CalendarSkeleton from "@/components/skeletons/CalendarSkeleton";
import { pageTransition } from "@/animations/page";
import { staggerContainer, staggerItem } from "@/animations/stagger";
import API from "@/services/api";
import { errorToast } from "@/services/toastService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Calendar() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchTrades = () => {
    setLoading(true);
    setLoadError(null);
    API.get("/trades?limit=500")
      .then((res) => setTrades(res.data || []))
      .catch(() => { setLoadError("Failed to load trades"); errorToast("Failed to load trades"); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrades(); }, []);

  const { days, monthlyPnl, tradeMap } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    const tradeMap = {};
    let mPnl = 0;
    trades.forEach((t) => {
      const dateStr = t.updatedAt || t.createdAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const key = d.getDate();
        if (!tradeMap[key]) tradeMap[key] = [];
        tradeMap[key].push(t);
        if (t.status !== "OPEN" && t.pnl != null) {
          mPnl += t.pnl;
        }
      }
    });

    return { days, monthlyPnl: mPnl, tradeMap };
  }, [trades, currentMonth, currentYear]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(now.getDate());
  };

  if (loading) return <CalendarSkeleton />;

  if (loadError && trades.length === 0) {
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="glass p-14 text-center">
          <h2 className="text-xl font-bold text-foreground">Failed to load trades</h2>
          <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          <button onClick={fetchTrades} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedTrades = selectedDate ? tradeMap[selectedDate] || [] : [];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1200px] mx-auto">
      <motion.div variants={staggerItem} initial="hidden" animate="show">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your daily performance</p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        {/* Calendar Grid */}
        <motion.div variants={staggerItem}>
          <GlassPanel className="p-5">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button onClick={goToPrevMonth} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={goToNextMonth} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">{MONTHS[currentMonth]} {currentYear}</h3>
                <p className={`text-sm font-mono font-semibold ${monthlyPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {monthlyPnl >= 0 ? "+" : ""}${monthlyPnl.toFixed(2)}
                </p>
              </div>
              <button onClick={goToToday} className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-sidebar-accent transition-colors">
                Today
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dayTrades = tradeMap[day] || [];
                const dayPnl = dayTrades.reduce((sum, t) => {
                  if (t.status !== "OPEN" && t.pnl != null) return sum + t.pnl;
                  return sum;
                }, 0);
                const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                const isSelected = day === selectedDate;
                const hasPositive = dayPnl > 0;
                const hasNegative = dayPnl < 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`rounded-lg border p-2 text-left transition-all min-h-[72px] ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : isToday
                          ? "border-primary/30 bg-primary/[0.03]"
                          : "border-border bg-background/30 hover:border-white/10"
                    }`}
                  >
                    <p className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                      {day}
                    </p>
                    {dayTrades.length > 0 && (
                      <>
                        <p className={`text-[10px] font-mono font-semibold mt-1 ${hasPositive ? "text-emerald-400" : hasNegative ? "text-red-400" : "text-muted-foreground"}`}>
                          {dayPnl >= 0 ? "+" : ""}${Math.abs(dayPnl).toFixed(0)}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{dayTrades.length} t</p>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Selected Day Panel */}
        <motion.div variants={staggerItem} className="space-y-4">
          <GlassPanel className="p-5">
            <h3 className="text-lg font-bold text-foreground">
              {selectedDate ? `${MONTHS[currentMonth]} ${selectedDate}` : "Select a day"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDate ? `${selectedTrades.length} trade${selectedTrades.length !== 1 ? "s" : ""}` : "Click on a day to view trades"}
            </p>

            {selectedDate && selectedTrades.length === 0 && (
              <div className="mt-6 text-center py-8 text-sm text-muted-foreground">
                No trades on this day
              </div>
            )}

            {selectedTrades.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedTrades.map((t) => {
                  const isLong = (t.tradeType || "").toUpperCase() === "LONG" || (t.tradeType || "").toUpperCase() === "BUY";
                  const pnl = t.pnl || 0;
                  const isClosed = t.status !== "OPEN";
                  return (
                    <div key={t.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold ${isLong ? "text-emerald-400" : "text-red-400"}`}>
                            {isLong ? "▲" : "▼"}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{t.symbol}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${isClosed ? (pnl >= 0 ? "text-emerald-400" : "text-red-400") : "text-blue-400"}`}>
                          {isClosed ? `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}` : "Open"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(Calendar);
