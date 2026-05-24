package com.TradeOS.analytics;

import com.TradeOS.dto.RiskRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RiskManagementService {

    public Map<String, Double> calculateRisk(
            RiskRequest request
    ) {

        double riskAmount =
                request.getAccountBalance()
                        *
                        (request.getRiskPercentage() / 100);

        double stopLossDistance =
                Math.abs(
                        request.getEntryPrice()
                                -
                                request.getStopLoss()
                );

        double positionSize =
                riskAmount / stopLossDistance;

        Map<String, Double> result =
                new HashMap<>();

        result.put(
                "riskAmount",
                riskAmount
        );

        result.put(
                "positionSize",
                positionSize
        );

        result.put(
                "stopLossDistance",
                stopLossDistance
        );

        return result;
    }
}