package com.TradeOS.controller;

import com.TradeOS.analytics.RiskManagementService;
import com.TradeOS.dto.RiskRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/risk")
public class RiskManagementController {

    @Autowired
    private RiskManagementService riskManagementService;

    @PostMapping("/calculate")
    public Map<String, Double> calculateRisk(
            @RequestBody RiskRequest request
    ) {

        return riskManagementService
                .calculateRisk(request);
    }
}