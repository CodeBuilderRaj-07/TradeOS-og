import { Brain }
  from "lucide-react";

export default function AIConfidenceCard() {

  return (

    <div className="relative overflow-hidden rounded-lg border border-success/10 bg-success/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10 text-green-400">

            <Brain size={18} />

          </div>

          <div>

            <h3 className="text-lg font-bold text-foreground">

              AI Confidence

            </h3>

            <p className="text-sm text-muted-foreground">

              Prediction engine accuracy

            </p>

          </div>

        </div>

        <h1 className="mt-8 text-5xl font-black tracking-tight text-muted-foreground">

          0%

        </h1>

        <p className="mt-5 text-sm leading-7 text-muted-foreground">

          No data available yet. Complete more trades to generate AI confidence analysis.

        </p>

      </div>

    </div>
  );
}