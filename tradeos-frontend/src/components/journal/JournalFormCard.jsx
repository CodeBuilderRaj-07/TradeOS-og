import { Flame }
  from "lucide-react";

export default function JournalFormCard({
  formData,
  handleChange,
  createJournal,
}) {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">

          <Flame size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-white">

            Create Journal

          </h3>

          <p className="text-sm text-zinc-500">

            Track execution quality

          </p>

        </div>

      </div>

      <div className="mt-6 space-y-4">

        <input
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="Symbol"
          className="h-12 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all focus:border-blue-500/20"
        />

        <input
          name="strategy"
          value={formData.strategy}
          onChange={handleChange}
          placeholder="Strategy"
          className="h-12 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all focus:border-blue-500/20"
        />

        <input
          name="emotion"
          value={formData.emotion}
          onChange={handleChange}
          placeholder="Emotion"
          className="h-12 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all focus:border-blue-500/20"
        />

        <input
          name="pnl"
          value={formData.pnl}
          onChange={handleChange}
          placeholder="PNL"
          className="h-12 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all focus:border-blue-500/20"
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Trade notes..."
          className="min-h-[150px] w-full resize-none rounded-2xl border border-white/5 bg-[#0B1120]/70 p-4 text-sm text-white outline-none transition-all focus:border-blue-500/20"
        />

        <button
          onClick={createJournal}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(37,99,235,0.25)]"
        >

          Save Journal

        </button>

      </div>

    </div>
  );
}