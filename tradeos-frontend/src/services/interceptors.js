import {
  getToken,
  removeToken,
} from "./tokenService";

import {
  errorToast,
} from "./toastService";

export const setupInterceptors =
  (api) => {

    // REQUEST INTERCEPTOR
    api.interceptors.request.use(

      (config) => {

        const token =
          getToken();

        if (token) {

          config.headers.Authorization =
            `Bearer ${token}`;
        }

        return config;
      },

      (error) =>
        Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    api.interceptors.response.use(

      (response) =>
        response,

      async (error) => {

        // Unauthorized
        if (
          error.response?.status ===
          401
        ) {

          removeToken();

          errorToast(
            "Session expired. Please login again."
          );

          window.location.href =
            "/login";
        }

        // Backend Message
        const backendMessage =

          error.response?.data
            ?.message ||

          error.message ||

          "Something went wrong";

        // Global Error Toast
        errorToast(
          backendMessage
        );

        return Promise.reject({

          ...error,

          message:
            backendMessage,
        });
      }
    );
  };