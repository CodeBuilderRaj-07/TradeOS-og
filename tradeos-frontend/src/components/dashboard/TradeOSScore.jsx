import { memo } from "react";
import { Award } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

const LEVELS = [
  { min: 90, label: "Elite", color: "text-purple-400", bar: "bg-purple-500" },
  { min: 75, label: "Pro", color: "text-emerald-400", bar: "bg-emerald-500" },
  { min: 60, label: "Consistent", color: "text-blue-400", bar: "bg-blue-500" },
  { min: 40, label: "Developing", color: "text-yellow-400", bar: "bg-yellow-500" },
  { min: 0, label: "Critical", color: "text-red-400", bar: "bg-red-500" },
];

const BREAKDOWNS = [
  { key: "winRate", label: "Win Rate", max: 30 },
  { key: "profitFactor", label: "Profit Factor", max: 25 },
  { key: "avgRMultiple", label: "R-Multiple", max: 15 },
  { key: "totalTrades", label: "Sample Size", max: 15 },
  { key: "streak", label: "Consistency", max: 10 },
  { key: "balance", label: "Win/Loss Balance", max: 5 },
];

const TradeOSScore = memo(function TradeOSScore({ score = 0, breakdown = {} }) {
  const level = LEVELS.find((l) => score >= l.min) || LEVELS[LEVELS.length - 1];

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award size={16} className="text-yellow-400" />
        <h3 className="text-sm font-medium text-muted-foreground">TradeOS Score</h3>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="currentColor" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${(2 * Math.PI * 42) * (1 - score / 100)}`}
              className={`transition-all duration-1000 ${level.color}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold font-mono ${level.color}`}>{score}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className={`text-sm font-bold ${level.color}`}>{level.label}</p>
          <div className="space-y-1">
            {BREAKDOWNS.map((b) => {
              const val = breakdown[b.key] || 0;
              const pct = Math.min(100, (val / b.max) * 100);
              return (
                <div key={b.key} className="flex items-center gap-2 text-[10px]">
                  <span className="w-20 text-muted-foreground truncate">{b.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${level.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right font-mono text-foreground/60">{Math.round(val)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
});

export default TradeOSScore;
