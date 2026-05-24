import toast
  from "react-hot-toast";

/* Success */
export const successToast =
  (message) => {

    toast.success(message, {

      duration: 3000,

      style: {
        background: "#0B1120",
        color: "#fff",
        border:
          "1px solid rgba(34,197,94,0.15)",
      },

      iconTheme: {
        primary: "#22C55E",
        secondary: "#fff",
      },
    });
  };

/* Error */
export const errorToast =
  (message) => {

    toast.error(message, {

      duration: 4000,

      style: {
        background: "#0B1120",
        color: "#fff",
        border:
          "1px solid rgba(239,68,68,0.15)",
      },

      iconTheme: {
        primary: "#EF4444",
        secondary: "#fff",
      },
    });
  };

/* Loading */
export const loadingToast =
  (message) => {

    return toast.loading(
      message,
      {

        style: {
          background: "#0B1120",
          color: "#fff",
          border:
            "1px solid rgba(59,130,246,0.15)",
        },
      }
    );
  };

/* Info */
export const infoToast =
  (message) => {

    toast(message, {

      duration: 3000,

      icon: "ℹ️",

      style: {
        background: "#0B1120",
        color: "#fff",
        border:
          "1px solid rgba(59,130,246,0.15)",
      },
    });
  };

/* Promise Toast */
export const promiseToast =
  (
    promise,
    messages
  ) => {

    return toast.promise(
      promise,
      {

        loading:
          messages.loading,

        success:
          messages.success,

        error:
          messages.error,
      },

      {

        style: {
          background: "#0B1120",
          color: "#fff",
        },
      }
    );
  };

/* Dismiss */
export const dismissToast =
  (id) => {

    toast.dismiss(id);
  };