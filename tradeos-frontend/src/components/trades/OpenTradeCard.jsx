import {
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
} from "lucide-react";

import GlassPanel
  from "@/components/ui/GlassPanel";

import TradeStat
  from "./TradeStat";

export default function OpenTradeCard({
  trade,
  closeTrade,
}) {

  const isSell =
    trade.tradeType === "SELL";

  return (

    <GlassPanel className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_auto]">

      {/* Symbol */}
      <div className="flex items-center gap-4">

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-lg ${
            isSell
              ? "bg-destructive/10"
              : "bg-success/10"
          }`}
        >

          {isSell ? (

            <ArrowDownRight
              size={22}
              className="text-red-400"
            />

          ) : (

            <ArrowUpRight
              size={22}
              className="text-green-400"
            />

          )}

        </div>

        <div>

          <h3 className="text-xl font-bold text-foreground">

            {trade.symbol}

          </h3>

          <p className="mt-1 text-sm text-muted-foreground">

            {trade.tradeType}

          </p>

        </div>

      </div>

      {/* Stats */}
      <TradeStat
        title="ENTRY"
        value={trade.entryPrice}
      />

      <TradeStat
        title="STOP LOSS"
        value={trade.stopLoss}
      />

      <TradeStat
        title="TAKE PROFIT"
        value={trade.takeProfit}
        blue
      />

      {/* PNL */}
      <div>

        <h2
          className={`text-3xl font-bold ${
            trade.pnl < 0
              ? "text-red-400"
              : "text-green-400"
          }`}
        >

          ${trade.pnl || 0}

        </h2>

        <div className="mt-3">

          <span className="rounded-full border border-success/10 bg-success/10 px-4 py-2 text-xs font-semibold text-green-400">

            OPEN

          </span>

        </div>

      </div>

      {/* Close */}
      <button
        onClick={() =>
          closeTrade(trade.id)
        }
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-red-400 transition-all duration-300 hover:bg-destructive/20"
      >

        <XCircle size={20} />

      </button>

    </GlassPanel>
  );
}