export default function AiTradeAnalysisCard() {

  return (

    <div className="rounded-lg border border-border bg-card p-5 backdrop-blur-2xl">

      <h3 className="text-lg font-bold text-foreground">

        AI Trade Analysis

      </h3>

      <p className="mt-3 text-sm text-muted-foreground">

        AI trade analysis will appear here after entering trade parameters.

      </p>

      <div className="mt-4 rounded-lg bg-primary/10 p-4 text-sm text-primary/80">

        Confidence: —% — Enter trade details for analysis

      </div>

    </div>
  );
}