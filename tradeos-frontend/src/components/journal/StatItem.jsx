export default function StatItem({
  title,
  value,
  green,
}) {

  return (

    <div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

        {title}

      </p>

      <h2
        className={`mt-2 text-3xl font-bold ${
          green
            ? "text-green-400"
            : "text-white"
        }`}
      >

        {value}

      </h2>

    </div>
  );
}