export default function InsightBadge({
  type,
}) {

  const styles = {

    Positive:
      "bg-green-500/10 text-green-400 border-green-500/10",

    Warning:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/10",

    Risk:
      "bg-red-500/10 text-red-400 border-red-500/10",
  };

  return (

    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
        styles[type]
      }`}
    >

      {type}

    </span>
  );
}