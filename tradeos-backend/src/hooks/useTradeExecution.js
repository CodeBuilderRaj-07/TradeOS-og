import {
  useState,
} from "react";

import API
  from "@/services/api";

import {
  successToast,
  errorToast,
} from "@/services/toastService";

export function useTradeExecution() {

  const [loading,
    setLoading] =
    useState(false);

  const [message,
    setMessage] =
    useState("");

  const [formData,
    setFormData] =
    useState({

      symbol: "",

      tradeType: "BUY",

      positionSize: "",

      entryPrice: "",

      stopLoss: "",

      takeProfit: "",

      notes: "",
    });

  /* Input Change */
  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  /* Trade Type */
  const setTradeType =
    (type) => {

      setFormData({

        ...formData,

        tradeType: type,
      });
    };

  /* Risk */
  const riskAmount =

    Math.abs(

      Number(
        formData.entryPrice
      ) -

      Number(
        formData.stopLoss
      )
    );

  /* Reward */
  const rewardAmount =

    Math.abs(

      Number(
        formData.takeProfit
      ) -

      Number(
        formData.entryPrice
      )
    );

  /* RR Ratio */
  const rrRatio =

    riskAmount > 0

      ? (
          rewardAmount /
          riskAmount
        ).toFixed(2)

      : "0";

  /* Submit */
  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        setMessage("");

        const payload = {

          symbol:
            formData.symbol,

          tradeType:
            formData.tradeType,

          positionSize:
            Number(
              formData.positionSize
            ),

          entryPrice:
            Number(
              formData.entryPrice
            ),

          stopLoss:
            Number(
              formData.stopLoss
            ),

          takeProfit:
            Number(
              formData.takeProfit
            ),

          notes:
            formData.notes,
        };

        const response =
          await API.post(
            "/trades",
            payload
          );

        successToast(
          response.data ||
          "Trade Created"
        );

        setMessage(
          "Trade executed successfully"
        );

        /* Reset */
        setFormData({

          symbol: "",

          tradeType: "BUY",

          positionSize: "",

          entryPrice: "",

          stopLoss: "",

          takeProfit: "",

          notes: "",
        });

      } catch (error) {

        console.error(
          error
        );

        errorToast(

          error.response?.data ||

          "Failed to execute trade"
        );

      } finally {

        setLoading(false);
      }
    };

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