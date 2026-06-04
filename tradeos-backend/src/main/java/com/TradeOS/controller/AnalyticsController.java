package com.TradeOS.controller;

import com.TradeOS.analytics.AnalyticsService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/monthly-pnl")
    public Map<String, Double> getMonthlyPnl(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return analyticsService
                .getMonthlyPnl(email);
    }

    @GetMapping("/streaks")
    public Map<String, Integer> getStreaks(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return analyticsService
                .getStreakAnalytics(email);
    }

    @GetMapping("/risk-reward")
    public Map<String, Double> getRiskReward(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return analyticsService
                .getRiskRewardAnalytics(email);
    }

    @GetMapping("/drawdown")
    public Map<String, Double> getDrawdown(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return analyticsService
                .getDrawdownAnalytics(email);
    }

    @GetMapping("/by-symbol")
    public Map<String, Map<String, Object>> getBySymbol(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return analyticsService
                .getPerformanceBySymbol(email);
    }
}