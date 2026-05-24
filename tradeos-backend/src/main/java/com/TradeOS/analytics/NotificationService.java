package com.TradeOS.analytics;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    public Map<String, String> sendNotification(
            String type
    ) {

        String message;

        switch (type.toLowerCase()) {

            case "profit":

                message =
                        "Great job! Your trade hit profit target.";

                break;

            case "loss":

                message =
                        "Warning: Your trade closed in loss. Review your strategy.";

                break;

            case "risk":

                message =
                        "Risk warning: You are exceeding safe risk limits.";

                break;

            default:

                message =
                        "TradeOS notification triggered.";
        }

        Map<String, String> result =
                new HashMap<>();

        result.put(
                "notification",
                message
        );

        return result;
    }
}