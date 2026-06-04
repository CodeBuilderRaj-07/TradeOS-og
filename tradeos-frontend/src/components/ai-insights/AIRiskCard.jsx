import {
  ShieldAlert,
} from "lucide-react";

export default function AIRiskCard() {

  return (

    <div className="relative overflow-hidden rounded-lg border border-yellow-500/10 bg-yellow-500/[0.05] p-6 backdrop-blur-2xl">

      <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">

            <ShieldAlert size={18} />

          </div>

          <div>

            <h3 className="text-lg font-bold text-foreground">

              Risk Detection

            </h3>

            <p className="text-sm text-muted-foreground">

              Behavioral risk monitoring

            </p>

          </div>

        </div>

        <h1 className="mt-8 text-5xl font-black tracking-tight text-muted-foreground">

          —

        </h1>

        <p className="mt-5 text-sm leading-7 text-muted-foreground">

          Not enough trading data to assess risk behavior.

        </p>

      </div>

    </div>
  );
}