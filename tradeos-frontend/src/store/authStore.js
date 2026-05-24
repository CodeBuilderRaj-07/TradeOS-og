import { create }
  from "zustand";

export const useAuthStore =
  create((set) => ({

    user: {
      id: 1,
      name: "Ashutosh",
      role: "TRADER",
    },

    token:
      localStorage.getItem(
        "token"
      ) || null,

    isAuthenticated:
      !!localStorage.getItem(
        "token"
      ),

    login:
      ({ user, token }) => {

        localStorage.setItem(
          "token",
          token
        );

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

    logout: () => {

      localStorage.removeItem(
        "token"
      );

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  }));