import { Flame }
  from "lucide-react";

export default function StreakCard() {

  return (

    <div className="<GlassPanel /> p-5 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">

          <Flame size={20} />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-white">

            Winning Streak

          </h3>

          <p className="text-xs text-zinc-500">

            Current momentum

          </p>

        </div>

      </div>

      <h1 className="mt-6 text-4xl font-bold text-white">

        7 Days

      </h1>

    </div>
  );
}