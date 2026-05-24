import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function TradeTypeSelector({
  tradeType,
  setTradeType,
}) {

  return (

    <div className="mb-6 grid grid-cols-2 gap-3">

      <button
        onClick={() =>
          setTradeType("BUY")
        }
        className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
          tradeType === "BUY"
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
            : "bg-[#0B1120]/70 text-zinc-400"
        }`}
      >

        <ArrowUpRight size={18} />

        Long Position

      </button>

      <button
        onClick={() =>
          setTradeType("SELL")
        }
        className={`flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
          tradeType === "SELL"
            ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
            : "bg-[#0B1120]/70 text-zinc-400"
        }`}
      >

        <ArrowDownRight size={18} />

        Short Position

      </button>

    </div>
  );
}