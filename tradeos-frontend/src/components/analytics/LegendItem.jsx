export default function LegendItem({
  color,
  title,
}) {

  return (

    <div className="flex items-center gap-2 text-sm text-zinc-400">

      <div
        className="h-3 w-3 rounded-full"
        style={{
          background: color,
        }}
      />

      <span>
        {title}
      </span>

    </div>
  );
}