export default function InsightItem({
  title,
  value,
  green,
}) {

  return (

    <div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">

        {title}

      </p>

      <h2
        className={`mt-2 text-3xl font-bold ${
          green
            ? "text-green-400"
            : "text-foreground"
        }`}
      >

        {value}

      </h2>

    </div>
  );
}