package com.TradeOS.controller;

import com.TradeOS.analytics.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{type}")
    public Map<String, String> sendNotification(
            @PathVariable String type
    ) {

        return notificationService
                .sendNotification(type);
    }
}