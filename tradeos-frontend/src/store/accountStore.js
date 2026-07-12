import { create } from "zustand";
import API from "@/services/api";

export const useAccountStore = create((set, get) => ({
  accounts: [],
  activeAccount: null,
  loading: false,

  fetchAccounts: async () => {
    set({ loading: true });
    try {
      const res = await API.get("/trading-accounts");
      const accounts = res.data || [];
      const active = accounts.find((a) => a.active) || accounts[0] || null;
      set({ accounts, activeAccount: active, loading: false });
      return accounts;
    } catch {
      set({ loading: false });
      return [];
    }
  },

  setActiveAccount: (account) => {
    set({ activeAccount: account });
    if (account?.id) {
      API.put(`/trading-accounts/${account.id}`, { active: true }).catch(() => {});
    }
  },
}));
