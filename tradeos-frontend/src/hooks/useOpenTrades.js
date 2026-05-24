import { useEffect }
  from "react";

import {
  useOpenTradesStore,
} from "@/store/openTradesStore";

export function useOpenTrades() {

  const {
    trades,
    loading,
    fetchOpenTrades,
    closeTrade,
  } = useOpenTradesStore();

  useEffect(() => {

    fetchOpenTrades();

  }, []);

  const totalExposure =
    trades.reduce(
      (total, trade) =>
        total +
        (trade.entryPrice || 0),
      0
    );

  const totalPnl =
    trades.reduce(
      (total, trade) =>
        total +
        (trade.pnl || 0),
      0
    );

  return {
    trades,
    loading,
    closeTrade,
    totalExposure,
    totalPnl,
  };
}