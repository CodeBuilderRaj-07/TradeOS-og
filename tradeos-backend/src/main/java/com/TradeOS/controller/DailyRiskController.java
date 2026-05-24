package com.TradeOS.controller;

import com.TradeOS.analytics.DailyRiskService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/daily-risk")
public class DailyRiskController {

    @Autowired
    private DailyRiskService dailyRiskService;

    @GetMapping
    public Map<String, Object> checkDailyRisk(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("email");

        return dailyRiskService
                .checkDailyRisk(email);
    }
}