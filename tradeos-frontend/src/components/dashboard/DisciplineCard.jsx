import { ShieldCheck }
  from "lucide-react";

export default function DisciplineCard() {

  return (

    <div className="<GlassPanel /> p-5 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">

          <ShieldCheck size={20} />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-white">

            Discipline Score

          </h3>

          <p className="text-xs text-zinc-500">

            Trading consistency

          </p>

        </div>

      </div>

      <h1 className="mt-6 text-5xl font-black tracking-tight text-green-400">

        92%

      </h1>

    </div>
  );
}