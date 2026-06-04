package com.TradeOS.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationPublisher {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void pushNotification(String title, String message, String type, String symbol) {
        Map<String, String> payload = new HashMap<>();
        payload.put("title", title);
        payload.put("message", message);
        payload.put("type", type);
        payload.put("symbol", symbol);
        payload.put("timestamp", String.valueOf(System.currentTimeMillis()));
        messagingTemplate.convertAndSend("/topic/notifications", payload);
    }
}
