import axios from "axios";

import {
  getToken,
  clearAuth,
} from "@/services/tokenService";

import {
  errorToast,
} from "@/services/toastService";

let redirecting = false;

/* Navigate without full page reload */
export function emitNavigate(path) {
  window.dispatchEvent(new CustomEvent("app-navigate", { detail: { path } }));
}

/* Axios Instance */
const API = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL || "/api",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

/* Request Interceptor */
API.interceptors.request.use(

  (config) => {

    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/* Response Interceptor */
API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const status = error?.response?.status;

    if (status === 401 && !redirecting && !window.location.pathname.startsWith("/login")) {
      redirecting = true;
      clearAuth();
      errorToast("Session expired. Please login again.");
      window.dispatchEvent(new CustomEvent("app-navigate", { detail: "/login" }));
    }

    if (status === 403) {
      errorToast("Access denied.");
    }

    if (status >= 500) {
      errorToast("Server error occurred.");
    }

    return Promise.reject(error);
  }
);

export default API;