export default function AISummaryCard() {

  return (

    <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-primary/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10">

        <h2 className="text-xl font-bold text-foreground">

          AI Summary

        </h2>

        <div className="mt-6 rounded-lg border border-border bg-card/60 p-5 text-sm leading-8 text-muted-foreground">

          No summary available. Start logging trades to receive AI-powered behavioral summaries.

        </div>

      </div>

    </div>
  );
}