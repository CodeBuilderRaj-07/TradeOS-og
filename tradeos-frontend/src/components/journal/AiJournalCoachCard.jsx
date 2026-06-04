import { Brain }
  from "lucide-react";

export default function AiJournalCoachCard() {

  return (

    <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-primary/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">

            <Brain size={18} />

          </div>

          <div>

            <h3 className="text-lg font-bold text-foreground">

              AI Journal Coach

            </h3>

            <p className="text-sm text-muted-foreground">

              Behavioral psychology insights

            </p>

          </div>

        </div>

        <div className="mt-6 rounded-lg border border-border bg-card/60 p-5 text-sm leading-7 text-muted-foreground">

          Start journaling your trades to receive behavioral psychology insights and personalized coaching from AI.

        </div>

      </div>

    </div>
  );
}