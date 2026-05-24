import TradesHeader from "@/components/trades/TradesHeader";
import TradeSummaryCard from "@/components/trades/TradeSummaryCard";
import OpenTradeCard from "@/components/trades/OpenTradeCard";
import EmptyTrades from "@/components/trades/EmptyTrades";

import {
  Wallet,
  Activity,
  TrendingUp,
} from "lucide-react";

import {
  useOpenTrades,
} from "@/hooks/useOpenTrades";

export default function OpenTrades() {

  const {
    trades,
    loading,
    closeTrade,
    totalExposure,
    totalPnl,
  } = useOpenTrades();

  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

      </div>
    );
  }

  return (

    <div className="space-y-6">

      <TradesHeader />

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <TradeSummaryCard
          title="TOTAL EXPOSURE"
          value={`$${totalExposure}`}
          icon={Wallet}
        />

        <TradeSummaryCard
          title="ACTIVE POSITIONS"
          value={trades.length}
          icon={Activity}
        />

        <TradeSummaryCard
          title="UNREALIZED PNL"
          value={`+$${totalPnl}`}
          icon={TrendingUp}
          green
        />

      </section>

      {/* Empty */}
      {trades.length === 0 && (
        <EmptyTrades />
      )}

      {/* Trades */}
      <section className="space-y-4">

        {trades.map((trade) => (

          <OpenTradeCard
            key={trade.id}
            trade={trade}
            closeTrade={closeTrade}
          />

        ))}

      </section>

    </div>
  );
}