import { TrendingUp }
  from "lucide-react";

import StatItem
  from "./StatItem";

export default function JournalStatsCard({
  journals,
}) {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

          <TrendingUp size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-white">

            Journal Stats

          </h3>

          <p className="text-sm text-zinc-500">

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

    </div>
  );
}