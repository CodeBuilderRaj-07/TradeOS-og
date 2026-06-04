import { useEffect, useCallback } from "react";
import { connectNotificationSocket, disconnectNotificationSocket } from "@/services/notificationSocket";
import { infoToast, successToast, errorToast } from "@/services/toastService";
import { playSound } from "@/services/notificationSound";
import { getNotificationSettings } from "@/services/notificationSettings";

export function useNotifications() {
  const handleNotification = useCallback((data) => {
    const { title, message, type } = data;
    const settings = getNotificationSettings();

    if (type === "tp" && !settings.tpEnabled) return;
    if (type === "sl" && !settings.slEnabled) return;
    if (type !== "tp" && type !== "sl" && !settings.beEnabled) return;

    if (settings.soundEnabled) playSound(type);

    const toastFn = type === "sl" ? errorToast : type === "tp" ? successToast : infoToast;
    toastFn(`${title}: ${message}`, { duration: 8000 });
  }, []);

  useEffect(() => {
    connectNotificationSocket(handleNotification);
    return () => {
      disconnectNotificationSocket();
    };
  }, [handleNotification]);
}
