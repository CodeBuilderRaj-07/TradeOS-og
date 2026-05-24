export default function JournalEntryCard({
  entry,
}) {

  return (

    <div className="rounded-3xl border border-white/5 bg-[#0B1120]/70 p-5 transition-all duration-300 hover:border-blue-500/10 hover:bg-[#0F172A]">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}
        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-xl font-bold text-white">

              {entry.symbol}

            </h3>

            <span className="rounded-full border border-blue-500/10 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-400">

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

          <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300">

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

          <p className="mt-2 text-xs text-zinc-500">

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