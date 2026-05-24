export default function AnalyticsMetricCard({
  title,
  value,
  icon: Icon,
  success,
}) {

  return (

    <div className="relative overflow-hidden <GlassPanel /> p-5 backdrop-blur-2xl">

      <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

            {title}

          </p>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

            <Icon size={18} />

          </div>

        </div>

        <h2
          className={`mt-6 text-3xl font-bold tracking-tight ${
            success
              ? "text-green-400"
              : "text-white"
          }`}
        >

          {value}

        </h2>

      </div>

    </div>
  );
}