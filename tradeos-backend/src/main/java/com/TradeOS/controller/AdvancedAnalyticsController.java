package com.TradeOS.controller;

import com.TradeOS.analytics.AdvancedAnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/advanced-analytics")
public class AdvancedAnalyticsController {

    @Autowired
    private AdvancedAnalyticsService advancedAnalyticsService;

    @GetMapping
    public Map<String, Object> getAnalytics(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("email");

        return advancedAnalyticsService
                .getAnalytics(email);
    }
}