package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiInsightsService {

    @Autowired
    private TradeRepository tradeRepository;

    public Map<String, String> generateInsights(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        int wins = 0;

        int losses = 0;

        int consecutiveLosses = 0;

        int maxConsecutiveLosses = 0;

        double totalProfit = 0;

        double totalLoss = 0;

        String bestSymbol = "";

        double bestSymbolProfit =
                Double.MIN_VALUE;

        Map<String, Double> symbolProfitMap =
                new HashMap<>();

        for (Trade trade : trades) {

            double pnl = trade.getPnl();

            if (pnl > 0) {

                wins++;

                totalProfit += pnl;

                consecutiveLosses = 0;

            } else if (pnl < 0) {

                losses++;

                totalLoss += Math.abs(pnl);

                consecutiveLosses++;

                if (consecutiveLosses
                        > maxConsecutiveLosses) {

                    maxConsecutiveLosses =
                            consecutiveLosses;
                }
            }

            symbolProfitMap.put(
                    trade.getSymbol(),

                    symbolProfitMap.getOrDefault(
                            trade.getSymbol(),
                            0.0
                    ) + pnl
            );
        }

        for (Map.Entry<String, Double> entry
                : symbolProfitMap.entrySet()) {

            if (entry.getValue()
                    > bestSymbolProfit) {

                bestSymbolProfit =
                        entry.getValue();

                bestSymbol =
                        entry.getKey();
            }
        }

        double winRate = 0;

        if ((wins + losses) > 0) {

            winRate =
                    ((double) wins
                            / (wins + losses))
                            * 100;
        }

        double averageWin = 0;

        double averageLoss = 0;

        if (wins > 0) {

            averageWin =
                    totalProfit / wins;
        }

        if (losses > 0) {

            averageLoss =
                    totalLoss / losses;
        }

        StringBuilder insight =
                new StringBuilder();

        insight.append(
                "Your win rate is "
        );

        insight.append(
                String.format(
                        "%.2f",
                        winRate
                )
        );

        insight.append("%.");

        if (!bestSymbol.isEmpty()) {

            insight.append(
                    " Your best performing asset is "
            );

            insight.append(bestSymbol);

            insight.append(".");
        }

        if (averageLoss > averageWin) {

            insight.append(
                    " Your average loss is bigger than your average win."
            );
        }

        if (losses > wins) {

            insight.append(
                    " You are losing more trades than winning."
            );
        }

        if (wins > losses) {

            insight.append(
                    " Your trading performance looks strong."
            );
        }

        if (maxConsecutiveLosses >= 3) {

            insight.append(
                    " Warning: You had multiple consecutive losing trades. Avoid emotional revenge trading."
            );
        }

        if ((wins + losses) > 15) {

            insight.append(
                    " You are trading frequently. Make sure you are following your strategy consistently."
            );
        }

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "aiInsight",
                insight.toString()
        );

        return response;
    }
}