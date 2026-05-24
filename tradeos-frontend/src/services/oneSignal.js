import OneSignal from "react-onesignal";

export const initializeOneSignal = async () => {

  try {

    await OneSignal.init({

      appId:
        "1b386370-f340-4502-b723-de0403c244d5",

      allowLocalhostAsSecureOrigin: true,

      serviceWorkerPath:
        "/OneSignalSDKWorker.js",

      serviceWorkerUpdaterPath:
        "/OneSignalSDKUpdaterWorker.js",
    });

    console.log(
      "OneSignal Initialized"
    );

  } catch (error) {

    console.log(error);
  }
};

export const requestNotificationPermission =
  async () => {

    try {

      const permission =
        await Notification.requestPermission();

      console.log(permission);

      if (permission === "granted") {

        alert(
          "Notifications Enabled 😎🔥"
        );
      }

    } catch (error) {

      console.log(error);
    }
};