import { useState }
  from "react";

import {
  useTradeExecutionStore,
} from "@/store/tradeExecutionStore";

export function useTradeExecution() {

  const {
    loading,
    message,
    formData,
    setFormData,
    executeTrade,
  } = useTradeExecutionStore();

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const setTradeType =
    (type) => {

      setFormData({
        ...formData,
        tradeType: type,
      });
    };

  const handleSubmit =
    async () => {

      await executeTrade();
    };

  const riskAmount =

    formData.entryPrice &&
    formData.stopLoss &&
    formData.positionSize

      ? (
          Math.abs(
            formData.entryPrice -
            formData.stopLoss
          ) *
          formData.positionSize
        ).toFixed(2)

      : 0;

  const rewardAmount =

    formData.entryPrice &&
    formData.takeProfit &&
    formData.positionSize

      ? (
          Math.abs(
            formData.takeProfit -
            formData.entryPrice
          ) *
          formData.positionSize
        ).toFixed(2)

      : 0;

  const rrRatio =

    riskAmount > 0

      ? (
          rewardAmount /
          riskAmount
        ).toFixed(2)

      : 0;

  return {

    loading,
    message,

    formData,
    handleChange,
    handleSubmit,
    setTradeType,

    riskAmount,
    rewardAmount,
    rrRatio,
  };
}