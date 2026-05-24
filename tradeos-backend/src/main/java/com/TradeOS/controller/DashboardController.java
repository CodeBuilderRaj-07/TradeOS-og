package com.TradeOS.controller;

import com.TradeOS.analytics.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("email");

        return analyticsService
                .getDashboardSummary(email);
    }
}