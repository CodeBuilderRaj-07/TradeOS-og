import React from "react";

import ReactDOM
  from "react-dom/client";

import {
  Toaster,
} from "react-hot-toast";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import AppRoutes
  from "@/app/router/AppRoutes";

import ErrorBoundary
  from "@/components/common/ErrorBoundary";

import "@/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    {/* Error Boundary */}
    <ErrorBoundary>

      {/* React Query */}
      <QueryClientProvider client={queryClient}>

        {/* Toast System */}
        <Toaster

          position="top-right"

          toastOptions={{

            style: {

              background:
                "#0B1120",

              color: "#fff",

              border:
                "1px solid rgba(255,255,255,0.05)",

              borderRadius: "18px",

              padding: "14px 16px",

              backdropFilter:
                "blur(20px)",

              boxShadow:
                "0 0 35px rgba(0,0,0,0.25)",
            },

            success: {

              style: {
                border:
                  "1px solid rgba(34,197,94,0.15)",
              },
            },

            error: {

              style: {
                border:
                  "1px solid rgba(239,68,68,0.15)",
              },
            },
          }}
        />

        {/* App */}
        <AppRoutes />

      </QueryClientProvider>

    </ErrorBoundary>

  </React.StrictMode>
);