import axios from "axios";

import {
  getToken,
  removeToken,
} from "@/services/tokenService";

import {
  errorToast,
} from "@/services/toastService";

/* Axios Instance */
const API = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||

    "https://tradeos-backend-xmcr.onrender.com/api",

  headers: {

    "Content-Type":
      "application/json",
  },

  timeout: 15000,
});

/* Request Interceptor */
API.interceptors.request.use(

  (config) => {

    const token =
      getToken();

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);

/* Response Interceptor */
API.interceptors.response.use(

  (response) =>
    response,

  async (error) => {

    const status =
      error?.response?.status;

    /* Unauthorized */
    if (status === 401) {

      removeToken();

      errorToast(
        "Session expired. Please login again."
      );

      window.location.href =
        "/login";
    }

    /* Forbidden */
    if (status === 403) {

      errorToast(
        "Access denied."
      );
    }

    /* Server Error */
    if (status >= 500) {

      errorToast(
        "Server error occurred."
      );
    }

    return Promise.reject(
      error
    );
  }
);

export default API;