import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let listeners = [];

const WS_URL = import.meta.env.VITE_WS_URL || "https://tradeos-backend-xmcr.onrender.com/ws";

export function connectNotificationSocket(onNotification) {
  listeners.push(onNotification);

  if (stompClient?.connected) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 10000,
    maxReconnectDelay: 60000,
    debug: () => {},
  });

  stompClient.onConnect = () => {
    stompClient.subscribe("/topic/notifications", (message) => {
      try {
        const data = JSON.parse(message.body);
        listeners.forEach((fn) => fn(data));
      } catch {
        // silent
      }
    });
  };

  stompClient.activate();
}

export function disconnectNotificationSocket() {
  listeners = [];
  if (stompClient?.connected) {
    stompClient.deactivate();
  }
  stompClient = null;
}
