import { ShieldCheck }
  from "lucide-react";

import InsightItem
  from "./InsightItem";

export default function StreakAnalyticsCard({
  streaks,
}) {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">

          <ShieldCheck size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-white">

            Streak Analytics

          </h3>

          <p className="text-sm text-zinc-500">

            Trading consistency tracking

          </p>

        </div>

      </div>

      <div className="mt-8 space-y-6">

        <InsightItem
          title="Current Win Streak"
          value={
            streaks.currentWinStreak || 0
          }
        />

        <InsightItem
          title="Current Loss Streak"
          value={
            streaks.currentLossStreak || 0
          }
        />

        <InsightItem
          title="Best Win Streak"
          value={
            streaks.bestWinStreak || 0
          }
          green
        />

      </div>

    </div>
  );
}