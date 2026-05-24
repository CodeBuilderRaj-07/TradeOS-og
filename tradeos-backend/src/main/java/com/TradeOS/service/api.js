import axios from "axios";

import {
  getToken,
  removeToken,
} from "@/services/tokenService";

import {
  errorToast,
} from "@/services/toastService";

const API = axios.create({

  baseURL:
    "https://tradeos-backend-xmcr.onrender.com/api",

  headers: {

    "Content-Type":
      "application/json",
  },
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

  (response) => response,

  (error) => {

    if (

      error.response?.status === 401
    ) {

      removeToken();

      errorToast(
        "Session expired. Please login again."
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(
      error
    );
  }
);

export default API;