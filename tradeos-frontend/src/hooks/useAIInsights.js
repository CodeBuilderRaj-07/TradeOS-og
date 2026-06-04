import { useEffect, useState }
  from "react";

import API from "@/services/api";
import { errorToast } from "@/services/toastService";

import {
  useAIInsightsStore,
} from "@/store/aiInsightsStore";

export function useAIInsights() {

  const {
    insights,
    loading,
    fetchInsights,
  } = useAIInsightsStore();

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    fetchInsights();

    API.get("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch(() => errorToast("Failed to load dashboard summary"));

  }, []);

  return {
    insights,
    loading,
    summary,
  };
}