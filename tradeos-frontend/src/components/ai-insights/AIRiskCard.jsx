import {
  ShieldAlert,
} from "lucide-react";

export default function AIRiskCard() {

  return (

    <div className="relative overflow-hidden rounded-3xl border border-yellow-500/10 bg-yellow-500/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">

            <ShieldAlert size={18} />

          </div>

          <div>

            <h3 className="text-lg font-bold text-white">

              Risk Detection

            </h3>

            <p className="text-sm text-zinc-500">

              Behavioral risk monitoring

            </p>

          </div>

        </div>

        <h1 className="mt-8 text-5xl font-black tracking-tight text-yellow-400">

          MED

        </h1>

        <p className="mt-5 text-sm leading-7 text-zinc-300">

          AI detected elevated emotional exposure after recent losing streaks and increased trading frequency.

        </p>

      </div>

    </div>
  );
}