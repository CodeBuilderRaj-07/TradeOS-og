import { TrendingUp }
  from "lucide-react";

import GlassPanel
  from "@/components/ui/GlassPanel";

export default function DrawdownCard({
  drawdown,
}) {

  return (

    <GlassPanel className="p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-red-400">

          <TrendingUp size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-foreground">

            Drawdown Analytics

          </h3>

          <p className="text-sm text-muted-foreground">

            Risk management insights

          </p>

        </div>

      </div>

      <h1 className="mt-8 text-5xl font-black tracking-tight text-red-400">

        ${(
          drawdown.maxDrawdown || 0
        ).toFixed(2)}

      </h1>

      <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400">

        Maximum historical account drawdown based on closed trades and historical market conditions.

      </p>

    </GlassPanel>
  );
}