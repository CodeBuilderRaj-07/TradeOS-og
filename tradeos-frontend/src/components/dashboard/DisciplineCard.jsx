import { ShieldCheck }
  from "lucide-react";

import GlassPanel from "@/components/ui/GlassPanel";

export default function DisciplineCard() {

  return (

    <GlassPanel className="p-5 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10 text-green-400">

          <ShieldCheck size={20} />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-foreground">

            Discipline Score

          </h3>

          <p className="text-xs text-muted-foreground">

            Trading consistency

          </p>

        </div>

      </div>

      <h1 className="mt-6 text-5xl font-black tracking-tight text-muted-foreground">

        0%

      </h1>

    </GlassPanel>
  );
}