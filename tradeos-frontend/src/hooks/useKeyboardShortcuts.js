import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    function handler(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        navigateRef.current("/new-trade");
        return;
      }

      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        navigateRef.current("/journal");
        return;
      }

      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        navigateRef.current("/");
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector("[data-search-input]");
        if (input) input.focus();
        return;
      }

      if (e.key === "Escape") {
        const closeBtn = document.querySelector("[data-close-modal]");
        if (closeBtn) closeBtn.click();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
