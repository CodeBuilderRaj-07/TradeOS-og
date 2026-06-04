import { create } from "zustand";

const THEME_KEY = "tradeos_theme";

function getInitial() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
  localStorage.setItem(THEME_KEY, theme);
}

applyTheme(getInitial());

export const useThemeStore = create((set) => ({
  theme: getInitial(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      return { theme: next };
    }),
}));
