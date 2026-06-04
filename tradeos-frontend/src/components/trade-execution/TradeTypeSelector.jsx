export default function TradeTypeSelector({
  tradeType,
  setTradeType,
}) {

  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => setTradeType("LONG")}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
          tradeType === "LONG"
            ? "bg-emerald-500 text-white"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        LONG
      </button>
      <button
        onClick={() => setTradeType("SHORT")}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
          tradeType === "SHORT"
            ? "bg-red-500 text-white"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        SHORT
      </button>
    </div>
  );
}
