import { memo } from "react";
import { TrendingUp, TrendingDown, Target, Flame, Zap, BarChart3 } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

function StatRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color || "text-muted-foreground"} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-xs font-mono font-semibold ${color || "text-foreground"}`}>{value}</span>
    </div>
  );
}

const TradeInsights = memo(function TradeInsights({
  profitFactor = 0,
  avgRMultiple = 0,
  avgRiskReward = 0,
  bestWinStreak = 0,
  currentWinStreak = 0,
  currentLossStreak = 0,
  grossProfit = 0,
  grossLoss = 0,
  avgWin = 0,
  avgLoss = 0,
  bestDay = "",
  bestDayPnl = 0,
  worstDay = "",
  worstDayPnl = 0,
}) {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} className="text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">Key Insights</h3>
      </div>

      <div className="divide-y divide-border/30">
        {profitFactor > 0 && (
          <StatRow
            icon={Target}
            label="Profit Factor"
            value={profitFactor.toFixed(2)}
            color={profitFactor >= 2 ? "text-emerald-400" : profitFactor >= 1 ? "text-yellow-400" : "text-red-400"}
          />
        )}
        {avgRMultiple > 0 && (
          <StatRow
            icon={Zap}
            label="Avg R-Multiple"
            value={avgRMultiple.toFixed(2)}
            color={avgRMultiple >= 2 ? "text-emerald-400" : avgRMultiple >= 1 ? "text-blue-400" : "text-yellow-400"}
          />
        )}
        {avgRiskReward > 0 && (
          <StatRow
            icon={Target}
            label="Avg R:R Ratio"
            value={`1:${avgRiskReward.toFixed(1)}`}
            color="text-blue-400"
          />
        )}
        <StatRow
          icon={Flame}
          label="Best Win Streak"
          value={`${bestWinStreak} ${bestWinStreak === 1 ? "trade" : "trades"}`}
          color="text-orange-400"
        />
        {currentWinStreak > 0 && (
          <StatRow
            icon={TrendingUp}
            label="Current Win Streak"
            value={`${currentWinStreak} ${currentWinStreak === 1 ? "trade" : "trades"}`}
            color="text-emerald-400"
          />
        )}
        {currentLossStreak > 0 && (
          <StatRow
            icon={TrendingDown}
            label="Current Loss Streak"
            value={`${currentLossStreak} ${currentLossStreak === 1 ? "trade" : "trades"}`}
            color="text-red-400"
          />
        )}
        {avgWin !== 0 && (
          <StatRow
            icon={TrendingUp}
            label="Avg Win"
            value={`$${avgWin.toFixed(2)}`}
            color="text-emerald-400"
          />
        )}
        {avgLoss !== 0 && (
          <StatRow
            icon={TrendingDown}
            label="Avg Loss"
            value={`-$${Math.abs(avgLoss).toFixed(2)}`}
            color="text-red-400"
          />
        )}
        {grossProfit > 0 && (
          <StatRow
            icon={TrendingUp}
            label="Gross Profit"
            value={`+$${grossProfit.toFixed(2)}`}
            color="text-emerald-400"
          />
        )}
        {grossLoss > 0 && (
          <StatRow
            icon={TrendingDown}
            label="Gross Loss"
            value={`-$${grossLoss.toFixed(2)}`}
            color="text-red-400"
          />
        )}
        {bestDay && (
          <StatRow
            icon={TrendingUp}
            label={`Best Day (${capitalize(bestDay)})`}
            value={`+$${bestDayPnl.toFixed(2)}`}
            color="text-emerald-400"
          />
        )}
        {worstDay && (
          <StatRow
            icon={TrendingDown}
            label={`Worst Day (${capitalize(worstDay)})`}
            value={`-$${Math.abs(worstDayPnl).toFixed(2)}`}
            color="text-red-400"
          />
        )}
      </div>
    </GlassPanel>
  );
});

export default TradeInsights;

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
