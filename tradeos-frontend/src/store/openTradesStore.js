import { create }
  from "zustand";

import API
  from "@/services/api";

export const useOpenTradesStore =
  create((set, get) => ({

    trades: [],
    loading: true,

    fetchOpenTrades:
      async () => {

        try {

          const response =
            await API.get(
              "/trades/open"
            );

          set({
            trades: response.data,
            loading: false,
          });

        } catch (error) {

          console.log(error);

          set({
            loading: false,
          });
        }
      },

    closeTrade:
      async (tradeId) => {

        try {

          await API.put(
            `/trades/${tradeId}/close`,
            {
              closePrice: 0,
            }
          );

          get().fetchOpenTrades();

        } catch (error) {

          console.log(error);
        }
      },
  }));