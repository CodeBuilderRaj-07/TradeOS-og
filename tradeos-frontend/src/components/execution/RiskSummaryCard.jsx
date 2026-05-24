import { ShieldCheck }
  from "lucide-react";

import RiskItem
  from "./RiskItem";

export default function RiskSummaryCard({
  riskAmount,
  rewardAmount,
  rrRatio,
}) {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

          <ShieldCheck size={18} />

        </div>

        <div>

          <h3 className="text-lg font-bold text-white">

            Risk Summary

          </h3>

          <p className="text-sm text-zinc-500">

            Live execution calculations

          </p>

        </div>

      </div>

      <div className="mt-8 space-y-6">

        <RiskItem
          title="Estimated Risk"
          value={`$${riskAmount}`}
        />

        <RiskItem
          title="Risk Reward Ratio"
          value={`1:${rrRatio}`}
          green
        />

        <RiskItem
          title="Potential Profit"
          value={`+$${rewardAmount}`}
          green
        />

      </div>

    </div>
  );
}