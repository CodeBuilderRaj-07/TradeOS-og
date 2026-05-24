package com.TradeOS.analytics;

import com.TradeOS.dto.BacktestRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BacktestService {

    public Map<String, Object> runBacktest(
            BacktestRequest request
    ) {

        int wins =
                (int) (
                        request.getTotalTrades()
                                *
                                (request.getWinRate() / 100)
                );

        int losses =
                request.getTotalTrades() - wins;

        double estimatedProfit =

                (wins * request.getRiskRewardRatio())

                        - losses;

        String result;

        if (estimatedProfit > 0) {

            result =
                    "Strategy looks profitable.";

        } else {

            result =
                    "Strategy may not be profitable.";
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "wins",
                wins
        );

        response.put(
                "losses",
                losses
        );

        response.put(
                "estimatedProfit",
                estimatedProfit
        );

        response.put(
                "result",
                result
        );

        return response;
    }
}