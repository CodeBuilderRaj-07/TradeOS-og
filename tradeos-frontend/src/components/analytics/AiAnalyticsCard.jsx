import { Brain }
  from "lucide-react";

export default function AiAnalyticsCard() {

  return (

    <div className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-blue-500/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

            <Brain size={18} />

          </div>

          <div>

            <h3 className="text-lg font-bold text-white">

              AI Analytics Coach

            </h3>

            <p className="text-sm text-zinc-500">

              Machine learning insights

            </p>

          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-white/5 bg-[#0B1120]/70 p-5 text-sm leading-7 text-zinc-300">

          Your analytics are now powered by real backend trading statistics, performance tracking, and behavioral analysis systems.

        </div>

      </div>

    </div>
  );
}