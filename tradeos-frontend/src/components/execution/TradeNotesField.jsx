export default function TradeNotesField({
  value,
  onChange,
}) {

  return (

    <div className="mt-6">

      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

        Trade Notes

      </label>

      <textarea
        name="notes"
        value={value}
        onChange={onChange}
        placeholder="Market structure, liquidity, psychology, setup confirmation..."
        className="min-h-[180px] w-full resize-none rounded-2xl border border-white/5 bg-[#0B1120]/70 p-4 text-sm leading-7 text-white outline-none transition-all focus:border-blue-500/20"
      />

    </div>
  );
}