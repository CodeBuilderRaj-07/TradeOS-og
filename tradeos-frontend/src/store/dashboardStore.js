import { create } from "zustand";

import API from "@/services/api";

export const useDashboardStore =
  create((set) => ({

    summary: {
      totalPnl: 0,
      totalTrades: 0,
      winRate: 0,
      openTrades: 0,
    },

    news: [],

    loading: true,

    fetchDashboardData:
      async () => {

        try {

          const [
            dashboardResponse,
            newsResponse,
          ] = await Promise.all([

            API.get(
              "/dashboard/summary"
            ),

            API.get("/news"),
          ]);

          set({

            summary:
              dashboardResponse.data,

            news:
              newsResponse.data
                .articles?.slice(0, 5) || [],

            loading: false,
          });

        } catch (error) {

          console.log(error);

          set({
            loading: false,
          });
        }
      },
  }));