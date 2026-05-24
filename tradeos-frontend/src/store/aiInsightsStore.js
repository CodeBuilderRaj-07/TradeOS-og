import { create }
  from "zustand";

export const useAIInsightsStore =
  create((set) => ({

    loading: true,

    insights: [],

    fetchInsights:
      async () => {

        try {

          const insights = [

            {
              title:
                "Overtrading Detected",

              description:
                "You opened 42% more trades this week compared to your average behavior.",

              type: "Warning",
            },

            {
              title:
                "Best Performance Hours",

              description:
                "Your highest win rate occurs between 9 AM and 12 PM market session.",

              type: "Positive",
            },

            {
              title:
                "Risk Management Improved",

              description:
                "Average stop loss discipline improved by 18% this month.",

              type: "Positive",
            },

            {
              title:
                "Emotional Trading Spike",

              description:
                "Losses increased after revenge-trading behavior on losing streaks.",

              type: "Risk",
            },
          ];

          set({
            insights,
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