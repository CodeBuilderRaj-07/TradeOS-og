import { create }
  from "zustand";

import API
  from "@/services/api";

export const useTradeExecutionStore =
  create((set, get) => ({

    loading: false,
    message: "",

    formData: {

      symbol: "",
      tradeType: "BUY",

      entryPrice: "",
      stopLoss: "",
      takeProfit: "",

      positionSize: "",

      notes: "",
    },

    setFormData:
      (data) =>
        set({
          formData: data,
        }),

    executeTrade:
      async () => {

        const {
          formData,
        } = get();

        try {

          set({
            loading: true,
            message: "",
          });

          await API.post(
            "/trades/create",
            {

              ...formData,

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

              positionSize:
                Number(
                  formData.positionSize
                ),
            }
          );

          set({

            message:
              "Trade Executed Successfully",

            formData: {

              symbol: "",
              tradeType: "BUY",

              entryPrice: "",
              stopLoss: "",
              takeProfit: "",

              positionSize: "",

              notes: "",
            },
          });

        } catch (error) {

          console.log(error);

          set({
            message:
              "Failed To Create Trade",
          });

        } finally {

          set({
            loading: false,
          });
        }
      },
  }));