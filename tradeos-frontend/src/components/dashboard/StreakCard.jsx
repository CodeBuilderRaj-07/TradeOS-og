import { Flame }
  from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";

export default function StreakCard() {

  return (

    <GlassPanel className="p-5 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

          <Flame size={20} />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-foreground">

            Winning Streak

          </h3>

          <p className="text-xs text-muted-foreground">

            Current momentum

          </p>

        </div>

      </div>

      <h1 className="mt-6 text-4xl font-bold text-foreground">

        0 Days

      </h1>

    </GlassPanel>
  );
}