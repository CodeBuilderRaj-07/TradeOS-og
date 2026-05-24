export default function ConfidenceCard() {

  return (

    <div>

      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

        Confidence Level

      </label>

      <div className="flex h-12 items-center justify-between rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4">

        <span className="text-white">
          84%
        </span>

        <span className="text-xs font-semibold text-blue-400">

          High Confidence

        </span>

      </div>

    </div>
  );
}