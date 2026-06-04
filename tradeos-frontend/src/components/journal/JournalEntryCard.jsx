export default function JournalEntryCard({
  entry,
}) {

  return (

    <div className="rounded-lg border border-border bg-card/60 p-5 transition-all duration-300 hover:border-primary/10 hover:bg-muted">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}
        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-xl font-bold text-foreground">

              {entry.symbol}

            </h3>

            <span className="rounded-full border border-primary/10 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">

              {entry.strategy}

            </span>

          </div>

          <p className="mt-4 text-sm text-zinc-400">

            Emotion:
            {" "}
            <span className="text-zinc-200">

              {entry.emotion}

            </span>

          </p>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">

            {entry.notes}

          </p>

        </div>

        {/* Right */}
        <div className="lg:text-right">

          <h2
            className={`text-3xl font-black tracking-tight ${
              entry.pnl < 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >

            ${entry.pnl}

          </h2>

          <p className="mt-2 text-xs text-muted-foreground">

            {
              entry.createdAt?.substring(
                0,
                10
              )
            }

          </p>

        </div>

      </div>

    </div>
  );
}