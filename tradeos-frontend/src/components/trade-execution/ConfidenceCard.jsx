export default function ConfidenceCard() {

  return (

    <div className="rounded-lg border border-border bg-card p-4 backdrop-blur-2xl">

      <h3 className="text-sm font-semibold text-foreground">

        AI Confidence

      </h3>

      <div className="mt-3 flex items-center justify-between">

        <span className="text-xs text-muted-foreground">

          Trade quality prediction

        </span>

        <span className="text-sm font-bold text-muted-foreground">

          0%

        </span>

      </div>

    </div>
  );
}