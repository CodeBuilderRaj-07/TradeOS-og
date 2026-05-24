export default function AccountStatCard({
  title,
  value,
  description,
}) {

  return (

    <div className="rounded-2xl border border-white/5 bg-[#0B1120]/70 p-5">

      <h3 className="text-base font-bold text-white">

        {title}

      </h3>

      <h2 className="mt-5 text-4xl font-black tracking-tight text-green-400">

        {value}

      </h2>

      <p className="mt-3 text-sm text-zinc-500">

        {description}

      </p>

    </div>
  );
}