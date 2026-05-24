import { Brain }
  from "lucide-react";

export default function AIConfidenceCard() {

  return (

    <div className="relative overflow-hidden rounded-3xl border border-green-500/10 bg-green-500/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">

            <Brain size={18} />

          </div>

          <div>

            <h3 className="text-lg font-bold text-white">

              AI Confidence

            </h3>

            <p className="text-sm text-zinc-500">

              Prediction engine accuracy

            </p>

          </div>

        </div>

        <h1 className="mt-8 text-5xl font-black tracking-tight text-green-400">

          92%

        </h1>

        <p className="mt-5 text-sm leading-7 text-zinc-300">

          Current AI models show strong statistical confidence based on historical execution behavior and live trade performance.

        </p>

      </div>

    </div>
  );
}