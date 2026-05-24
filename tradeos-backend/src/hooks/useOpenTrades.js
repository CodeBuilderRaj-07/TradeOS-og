import {
  useEffect,
  useState,
} from "react";

import API
  from "@/services/api";

import {
  errorToast,
  successToast,
} from "@/services/toastService";

export function useOpenTrades() {

  const [loading,
    setLoading] =
    useState(true);

  const [trades,
    setTrades] =
    useState([]);

  /* Fetch Open Trades */
  const fetchOpenTrades =
    async () => {

      try {

        setLoading(true);

        const response =
          await API.get(
            "/trades/open"
          );

        setTrades(
          response.data || []
        );

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to load open trades"
        );

      } finally {

        setLoading(false);
      }
    };

  /* Delete Trade */
  const deleteTrade =
    async (id) => {

      try {

        await API.delete(
          `/trades/${id}`
        );

        setTrades((prev) =>

          prev.filter(
            (trade) =>
              trade.id !== id
          )
        );

        successToast(
          "Trade deleted"
        );

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to delete trade"
        );
      }
    };

  /* Close Trade */
  const closeTrade =
    async (
      id,
      closePrice
    ) => {

      try {

        await API.put(
          `/trades/${id}/close`,
          {
            closePrice:
              Number(
                closePrice
              ),
          }
        );

        successToast(
          "Trade closed"
        );

        fetchOpenTrades();

      } catch (error) {

        console.error(
          error
        );

        errorToast(
          "Failed to close trade"
        );
      }
    };

  useEffect(() => {

    fetchOpenTrades();

  }, []);

  return {

    loading,
    trades,

    fetchOpenTrades,

    deleteTrade,
    closeTrade,
  };
}