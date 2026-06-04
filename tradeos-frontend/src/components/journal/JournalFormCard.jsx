import { Flame }
  from "lucide-react";

import GlassPanel
  from "@/components/ui/GlassPanel";

export default function JournalFormCard({
  formData,
  handleChange,
  createJournal,
}) {

  return (

    <GlassPanel className="p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">

          <Flame size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-foreground">

            Create Journal

          </h3>

          <p className="text-sm text-muted-foreground">

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
          className="h-12 w-full rounded-lg border border-border bg-card/60 px-4 text-sm text-foreground outline-none transition-all focus:border-primary/30"
        />

        <input
          name="strategy"
          value={formData.strategy}
          onChange={handleChange}
          placeholder="Strategy"
          className="h-12 w-full rounded-lg border border-border bg-card/60 px-4 text-sm text-foreground outline-none transition-all focus:border-primary/30"
        />

        <input
          name="emotion"
          value={formData.emotion}
          onChange={handleChange}
          placeholder="Emotion"
          className="h-12 w-full rounded-lg border border-border bg-card/60 px-4 text-sm text-foreground outline-none transition-all focus:border-primary/30"
        />

        <input
          name="pnl"
          value={formData.pnl}
          onChange={handleChange}
          placeholder="PNL"
          className="h-12 w-full rounded-lg border border-border bg-card/60 px-4 text-sm text-foreground outline-none transition-all focus:border-primary/30"
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Trade notes..."
          className="min-h-[150px] w-full resize-none rounded-lg border border-border bg-card/60 p-4 text-sm text-foreground outline-none transition-all focus:border-primary/30"
        />

        <button
          onClick={createJournal}
          className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors"
        >

          Save Journal

        </button>

      </div>

    </GlassPanel>
  );
}