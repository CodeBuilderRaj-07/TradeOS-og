import { create }
  from "zustand";

import API
  from "@/services/api";

export const useAnalyticsStore =
  create((set) => ({

    summary: {},
    monthlyPnl: [],
    streaks: {},
    riskReward: {},
    drawdown: {},
    loading: true,

    fetchAnalytics:
      async () => {

        try {

          const [
            summaryRes,
            monthlyRes,
            streakRes,
            rrRes,
            drawdownRes,
          ] = await Promise.all([

            API.get(
              "/dashboard/summary"
            ),

            API.get(
              "/analytics/monthly-pnl"
            ),

            API.get(
              "/analytics/streaks"
            ),

            API.get(
              "/analytics/risk-reward"
            ),

            API.get(
              "/analytics/drawdown"
            ),
          ]);

          const monthlyData =
            Object.entries(
              monthlyRes.data
            ).map(
              ([month, pnl]) => ({
                month:
                  month.substring(
                    0,
                    3
                  ),
                pnl,
              })
            );

          set({

            summary:
              summaryRes.data,

            monthlyPnl:
              monthlyData,

            streaks:
              streakRes.data,

            riskReward:
              rrRes.data,

            drawdown:
              drawdownRes.data,

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