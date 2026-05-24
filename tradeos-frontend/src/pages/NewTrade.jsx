import TradeExecutionHeader
  from "@/components/trade-execution/TradeExecutionHeader";

import TradeTypeSelector
  from "@/components/trade-execution/TradeTypeSelector";

import TradeInputField
  from "@/components/trade-execution/TradeInputField";

import TradeNotesField
  from "@/components/trade-execution/TradeNotesField";

import RiskSummaryCard
  from "@/components/trade-execution/RiskSummaryCard";

import AiTradeAnalysisCard
  from "@/components/trade-execution/AiTradeAnalysisCard";

import ConfidenceCard
  from "@/components/trade-execution/ConfidenceCard";

import TradeMessage
  from "@/components/trade-execution/TradeMessage";

import {
  useTradeExecution,
} from "@/hooks/useTradeExecution";

export default function NewTrade() {

  const {

    loading,
    message,

    formData,
    handleChange,
    handleSubmit,
    setTradeType,

    riskAmount,
    rewardAmount,
    rrRatio,

  } = useTradeExecution();

  return (

    <div className="space-y-6">

      <TradeExecutionHeader
        loading={loading}
        handleSubmit={handleSubmit}
      />

      {message && (
        <TradeMessage
          message={message}
        />
      )}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.8fr]">

        {/* Left */}
        <GlassPanel className="p-6">

          <TradeTypeSelector
            tradeType={formData.tradeType}
            setTradeType={setTradeType}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <TradeInputField
              label="Trading Pair"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="BTCUSD"
            />

            <TradeInputField
              label="Position Size"
              name="positionSize"
              value={
                formData.positionSize
              }
              onChange={handleChange}
              placeholder="0.10"
            />

            <TradeInputField
              label="Entry Price"
              name="entryPrice"
              value={
                formData.entryPrice
              }
              onChange={handleChange}
              placeholder="0.00"
            />

            <TradeInputField
              label="Stop Loss"
              name="stopLoss"
              value={
                formData.stopLoss
              }
              onChange={handleChange}
              placeholder="0.00"
            />

            <TradeInputField
              label="Take Profit"
              name="takeProfit"
              value={
                formData.takeProfit
              }
              onChange={handleChange}
              placeholder="0.00"
            />

            <ConfidenceCard />

          </div>

          <TradeNotesField
            value={formData.notes}
            onChange={handleChange}
          />

        </GlassPanel>

        {/* Right */}
        <div className="space-y-4">

          <RiskSummaryCard
            riskAmount={riskAmount}
            rewardAmount={rewardAmount}
            rrRatio={rrRatio}
          />

          <AiTradeAnalysisCard />

        </div>

      </section>

    </div>
  );
}