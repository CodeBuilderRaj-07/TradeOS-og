export default function RiskSummaryCard({
  riskAmount,
  rewardAmount,
  rrRatio,
}) {
  const risk = (riskAmount != null && !isNaN(riskAmount)) ? `$${Number(riskAmount).toFixed(2)}` : "$0.00";
  const reward = (rewardAmount != null && !isNaN(rewardAmount)) ? `$${Number(rewardAmount).toFixed(2)}` : "$0.00";
  const ratio = (rrRatio != null && !isNaN(rrRatio)) ? `1:${Number(rrRatio).toFixed(2)}` : "1:0.00";

  return (
    <div className="rounded-lg border border-border bg-card p-5 backdrop-blur-2xl">
      <h3 className="text-lg font-bold text-foreground">
        Risk Summary
      </h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Risk</span>
          <span className="text-destructive">{risk}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Reward</span>
          <span className="text-success">{reward}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>R:R Ratio</span>
          <span className="text-primary">{ratio}</span>
        </div>
      </div>
    </div>
  );
}
