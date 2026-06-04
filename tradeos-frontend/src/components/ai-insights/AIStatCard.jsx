export default function AIStatCard({
  title,
  value,
  description,
  icon: Icon,
  green,
  warning,
}) {

  return (

    <div className="relative overflow-hidden <GlassPanel /> p-5 backdrop-blur-2xl">

      <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">

            {title}

          </p>

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">

            <Icon size={18} />

          </div>

        </div>

        <h2
          className={`mt-6 text-3xl font-bold tracking-tight ${
            green
              ? "text-green-400"
              : warning
              ? "text-yellow-400"
              : "text-foreground"
          }`}
        >

          {value}

        </h2>

        <p className="mt-2 text-sm text-muted-foreground">

          {description}

        </p>

      </div>

    </div>
  );
}