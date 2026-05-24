package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PsychologyAiService {

    @Autowired
    private TradeRepository tradeRepository;

    public Map<String, String> analyzePsychology(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        int wins = 0;

        int losses = 0;

        int revengeTradingCount = 0;

        double totalProfit = 0;

        double totalLoss = 0;

        int consecutiveLosses = 0;

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

                if (consecutiveLosses >= 2) {

                    revengeTradingCount++;
                }
            }
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

        StringBuilder psychology =
                new StringBuilder();

        if (revengeTradingCount >= 2) {

            psychology.append(
                    "You may be revenge trading after losses. Consider taking breaks after consecutive losing trades. "
            );
        }

        if (averageLoss > averageWin) {

            psychology.append(
                    "Your losses are emotionally larger than your wins. Focus on risk management. "
            );
        }

        if (wins > losses) {

            psychology.append(
                    "You appear disciplined and emotionally stable in your trading."
            );
        }

        if (losses > wins) {

            psychology.append(
                    "Your trading psychology may be affected by overtrading or emotional entries."
            );
        }

        if (psychology.isEmpty()) {

            psychology.append(
                    "Your trading psychology currently looks balanced."
            );
        }

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "psychologyInsight",
                psychology.toString()
        );

        return response;
    }
}