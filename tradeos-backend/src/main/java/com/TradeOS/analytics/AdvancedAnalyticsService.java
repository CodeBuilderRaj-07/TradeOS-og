package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdvancedAnalyticsService {

    @Autowired
    private TradeRepository tradeRepository;

    public Map<String, Object> getAnalytics(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        int wins = 0;

        int losses = 0;

        double totalProfit = 0;

        double totalLoss = 0;

        double biggestWin = 0;

        double biggestLoss = 0;

        for (Trade trade : trades) {

            double pnl = trade.getPnl();

            if (pnl > 0) {

                wins++;

                totalProfit += pnl;

                if (pnl > biggestWin) {

                    biggestWin = pnl;
                }

            } else if (pnl < 0) {

                losses++;

                totalLoss += Math.abs(pnl);

                if (pnl < biggestLoss) {

                    biggestLoss = pnl;
                }
            }
        }

        int totalTrades =
                wins + losses;

        double winRate = 0;

        if (totalTrades > 0) {

            winRate =
                    ((double) wins
                            / totalTrades)
                            * 100;
        }

        double profitFactor = 0;

        if (totalLoss > 0) {

            profitFactor =
                    totalProfit / totalLoss;
        }

        double averageWin = 0;

        if (wins > 0) {

            averageWin =
                    totalProfit / wins;
        }

        double averageLoss = 0;

        if (losses > 0) {

            averageLoss =
                    totalLoss / losses;
        }

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "totalTrades",
                totalTrades
        );

        result.put(
                "wins",
                wins
        );

        result.put(
                "losses",
                losses
        );

        result.put(
                "winRate",
                winRate
        );

        result.put(
                "totalProfit",
                totalProfit
        );

        result.put(
                "totalLoss",
                totalLoss
        );

        result.put(
                "profitFactor",
                profitFactor
        );

        result.put(
                "averageWin",
                averageWin
        );

        result.put(
                "averageLoss",
                averageLoss
        );

        result.put(
                "biggestWin",
                biggestWin
        );

        result.put(
                "biggestLoss",
                biggestLoss
        );

        return result;
    }
}