import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let notificationListeners = [];
let tradeListeners = [];

const WS_URL = import.meta.env.VITE_WS_URL || "https://tradeos-backend-xmcr.onrender.com/ws";

export function connectNotificationSocket(onNotification) {
  notificationListeners.push(onNotification);
  ensureConnected();
}

export function connectTradeSocket(onTrade) {
  tradeListeners.push(onTrade);
  ensureConnected();
}

export function disconnectNotificationSocket() {
  notificationListeners = [];
  if (!tradeListeners.length) deactivate();
}

export function disconnectTradeSocket() {
  tradeListeners = [];
  if (!notificationListeners.length) deactivate();
}

function ensureConnected() {
  if (stompClient?.connected) return;
  if (stompClient) { stompClient.deactivate(); }

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
        notificationListeners.forEach((fn) => fn(data));
      } catch { /* silent */ }
    });
    stompClient.subscribe("/topic/trades", (message) => {
      try {
        const data = JSON.parse(message.body);
        tradeListeners.forEach((fn) => fn(data));
      } catch { /* silent */ }
    });
  };

  stompClient.activate();
}

function deactivate() {
  if (stompClient?.connected) {
    stompClient.deactivate();
  }
  stompClient = null;
}
