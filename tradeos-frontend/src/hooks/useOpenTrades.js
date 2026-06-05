import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";
import { errorToast, successToast } from "@/services/toastService";

export function useOpenTrades() {
  const queryClient = useQueryClient();

  const { data: trades = [], isLoading, error, refetch } = useQuery({
    queryKey: ["openTrades"],
    queryFn: async () => {
      const response = await API.get("/trades/open");
      return response.data || [];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["openTrades"] });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/trades/${id}`),
    onSuccess: () => {
      successToast("Trade deleted");
      invalidate();
    },
    onError: () => {
      errorToast("Failed to delete trade");
    },
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, closePrice }) => {
      const payload = closePrice !== undefined ? { exitPrice: Number(closePrice) } : {};
      return API.put(`/trades/${id}/close`, payload);
    },
    onSuccess: () => {
      successToast("Trade closed");
      invalidate();
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Failed to close trade";
      errorToast(msg);
    },
  });

  const deleteTrade = (id) => deleteMutation.mutate(id);
  const closeTrade = (id, closePrice) => closeMutation.mutate({ id, closePrice });

  const totalExposure = trades.reduce(
    (sum, t) => sum + (t.entryPrice || 0) * (t.positionSize || 0),
    0
  );

  const totalPnl = trades.reduce(
    (sum, t) => sum + (t.pnl || 0),
    0
  );

  return {
    loading: isLoading,
    trades,
    error: error ? (error.message || "Failed to load open trades") : null,
    totalExposure,
    totalPnl,
    fetchOpenTrades: refetch,
    deleteTrade,
    closeTrade,
  };
}
