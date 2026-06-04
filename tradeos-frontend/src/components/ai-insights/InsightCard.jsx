import InsightBadge
  from "./InsightBadge";

export default function InsightCard({
  insight,
}) {

  return (

    <div className="rounded-lg border border-border bg-card/60 p-5 transition-all duration-300 hover:border-primary/10 hover:bg-muted">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <h3 className="text-lg font-semibold text-foreground">

          {insight.title}

        </h3>

        <InsightBadge
          type={insight.type}
        />

      </div>

      <p className="mt-5 max-w-4xl text-sm leading-7 text-muted-foreground">

        {insight.description}

      </p>

    </div>
  );
}