export default function AISummaryCard() {

  return (

    <div className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-blue-500/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-60px] top-[-60px] h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <h2 className="text-xl font-bold text-white">

          AI Summary

        </h2>

        <div className="mt-6 rounded-2xl border border-white/5 bg-[#0B1120]/70 p-5 text-sm leading-8 text-zinc-300">

          Your trading behavior shows strong consistency during structured market sessions.

          Performance decreases significantly during emotional re-entries and high-frequency trading periods.

          Current data suggests maintaining lower exposure after consecutive losses can improve long-term profitability.

        </div>

      </div>

    </div>
  );
}