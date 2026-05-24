import InsightBadge
  from "./InsightBadge";

export default function InsightCard({
  insight,
}) {

  return (

    <div className="rounded-3xl border border-white/5 bg-[#0B1120]/70 p-5 transition-all duration-300 hover:border-blue-500/10 hover:bg-[#0F172A]">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <h3 className="text-lg font-semibold text-white">

          {insight.title}

        </h3>

        <InsightBadge
          type={insight.type}
        />

      </div>

      <p className="mt-5 max-w-4xl text-sm leading-7 text-zinc-300">

        {insight.description}

      </p>

    </div>
  );
}