import { Activity }
  from "lucide-react";

export default function AIBehaviorCard() {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">

          <Activity size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-white">

            Behavioral Analysis

          </h3>

          <p className="text-sm text-zinc-500">

            Execution psychology insights

          </p>

        </div>

      </div>

      <div className="mt-6 space-y-4">

        <div className="rounded-2xl border border-white/5 bg-[#0B1120]/70 p-4">

          <p className="text-sm text-zinc-300 leading-7">

            You perform significantly better during structured market sessions with lower emotional volatility.

          </p>

        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0B1120]/70 p-4">

          <p className="text-sm text-zinc-300 leading-7">

            High-frequency entries after consecutive losses reduce long-term consistency.

          </p>

        </div>

      </div>

    </div>
  );
}