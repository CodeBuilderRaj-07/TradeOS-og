import { TrendingUp }
  from "lucide-react";

import StatItem
  from "./StatItem";

import GlassPanel
  from "@/components/ui/GlassPanel";

export default function JournalStatsCard({
  journals,
}) {

  return (

    <GlassPanel className="p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">

          <TrendingUp size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-foreground">

            Journal Stats

          </h3>

          <p className="text-sm text-muted-foreground">

            Performance psychology

          </p>

        </div>

      </div>

      <div className="mt-8 space-y-6">

        <StatItem
          title="Total Entries"
          value={journals.length}
        />

        <StatItem
          title="Winning Journals"
          value={
            journals.filter(
              (j) => j.pnl > 0
            ).length
          }
          green
        />

        <StatItem
          title="Losing Journals"
          value={
            journals.filter(
              (j) => j.pnl < 0
            ).length
          }
        />

      </div>

    </GlassPanel>
  );
}