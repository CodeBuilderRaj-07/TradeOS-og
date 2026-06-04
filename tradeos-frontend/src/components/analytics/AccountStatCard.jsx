export default function AccountStatCard({
  title,
  value,
  description,
}) {

  return (

    <div className="rounded-lg border border-border bg-card/60 p-5">

      <h3 className="text-base font-bold text-foreground">

        {title}

      </h3>

      <h2 className="mt-5 text-4xl font-black tracking-tight text-green-400">

        {value}

      </h2>

      <p className="mt-3 text-sm text-muted-foreground">

        {description}

      </p>

    </div>
  );
}