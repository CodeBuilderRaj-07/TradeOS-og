import { useEffect }
  from "react";

import {
  useAIInsightsStore,
} from "@/store/aiInsightsStore";

export function useAIInsights() {

  const {
    insights,
    loading,
    fetchInsights,
  } = useAIInsightsStore();

  useEffect(() => {

    fetchInsights();

  }, []);

  return {
    insights,
    loading,
  };
}