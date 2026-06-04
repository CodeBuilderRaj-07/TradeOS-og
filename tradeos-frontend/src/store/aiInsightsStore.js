import { create }
  from "zustand";

import API
  from "@/services/api";

const parseInsightText = (text, type) => {
  if (!text) return [];
  const sentences = text.split(/(?<=\.)\s+/).filter(Boolean);
  return sentences.map((s) => ({
    title: s.length > 50 ? s.slice(0, 50) + "..." : "AI Insight",
    description: s,
    type,
  }));
};

export const useAIInsightsStore =
  create((set) => ({

    loading: true,
    insights: [],
    aiInsight: "",
    psychologyInsight: "",

    fetchInsights:
      async () => {

        try {

          const [aiRes, psychRes] = await Promise.allSettled([
            API.get("/ai/insights"),
            API.get("/psychology/analyze"),
          ]);

          const aiText = aiRes.value?.data?.aiInsight || "";
          const psychText = psychRes.value?.data?.psychologyInsight || "";

          const aiCards = parseInsightText(aiText, "Positive");
          const psychCards = parseInsightText(psychText, "Warning");

          set({
            insights: [...aiCards, ...psychCards],
            aiInsight: aiText,
            psychologyInsight: psychText,
            loading: false,
          });

        } catch (error) {

          console.error(error);

          set({
            loading: false,
          });
        }
      },
  }));