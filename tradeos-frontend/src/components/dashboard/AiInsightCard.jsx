import { Brain }
  from "lucide-react";

export default function AiInsightCard() {

  return (

    <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-primary/[0.05] p-5 backdrop-blur-2xl">

      <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">

            <Brain size={20} />

          </div>

          <div>

            <h3 className="text-sm font-semibold text-foreground">

              AI Market Insight

            </h3>

            <p className="text-xs text-muted-foreground">

              Generated analysis

            </p>

          </div>

        </div>

        <p className="mt-6 text-sm leading-7 text-muted-foreground">

          No AI insights available yet. Start trading to generate analysis.

        </p>

      </div>

    </div>
  );
}