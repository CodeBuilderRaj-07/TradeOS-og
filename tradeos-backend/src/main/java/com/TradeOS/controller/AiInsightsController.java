package com.TradeOS.controller;

import com.TradeOS.analytics.AiInsightsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiInsightsController {

    @Autowired
    private AiInsightsService aiInsightsService;

    @GetMapping("/insights")
    public Map<String, String> getInsights(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("email");

        return aiInsightsService
                .generateInsights(email);
    }
}