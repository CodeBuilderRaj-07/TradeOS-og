import { Activity }
  from "lucide-react";

import GlassPanel
  from "@/components/ui/GlassPanel";

export default function AIBehaviorCard() {

  return (

    <GlassPanel className="p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">

          <Activity size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-foreground">

            Behavioral Analysis

          </h3>

          <p className="text-sm text-muted-foreground">

            Execution psychology insights

          </p>

        </div>

      </div>

      <div className="mt-6 space-y-4">

        <div className="rounded-lg border border-border bg-card/60 p-4">

          <p className="text-sm text-muted-foreground leading-7">

            Not enough behavioral data. Log more trades to receive psychology insights.

          </p>

        </div>

      </div>

    </GlassPanel>
  );
}