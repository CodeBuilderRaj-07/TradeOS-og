import { create }
  from "zustand";

import {
  getToken,
  getUser,
  clearAuth,
} from "@/services/tokenService";

export const useAuthStore =
  create((set) => ({

    user: getUser(),

    token: getToken(),

    isAuthenticated:
      !!getToken(),

    login:
      ({ user, token }) => {

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

    logout: () => {

      clearAuth();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  }));