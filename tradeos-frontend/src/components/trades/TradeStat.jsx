export default function TradeStat({
  title,
  value,
  blue,
}) {

  return (

    <div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">

        {title}

      </p>

      <h3
        className={`text-lg font-bold ${
          blue
            ? "text-primary"
            : "text-foreground"
        }`}
      >

        {value}

      </h3>

    </div>
  );
}