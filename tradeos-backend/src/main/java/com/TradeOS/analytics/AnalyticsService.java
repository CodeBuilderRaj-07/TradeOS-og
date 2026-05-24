package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private TradeRepository tradeRepository;

    public Map<String, Object> getDashboardSummary(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        int totalTrades = trades.size();

        int winningTrades = 0;

        double totalPnl = 0;

        int openTrades = 0;

        int closedTrades = 0;

        for (Trade trade : trades) {

            totalPnl += trade.getPnl();

            if (trade.getPnl() > 0) {
                winningTrades++;
            }

            if (trade.getStatus().equals("OPEN")) {
                openTrades++;
            }

            if (trade.getStatus().equals("CLOSED")) {
                closedTrades++;
            }
        }

        double winRate = 0;

        if (totalTrades > 0) {

            winRate =
                    ((double) winningTrades
                            / totalTrades) * 100;
        }

        Map<String, Object> data =
                new HashMap<>();

        data.put("winningTrades", winningTrades);

        data.put("totalTrades", totalTrades);

        data.put("winRate", winRate);

        data.put("totalPnl", totalPnl);

        data.put("openTrades", openTrades);

        data.put("closedTrades", closedTrades);

        return data;
    }

    public Map<String, Double> getMonthlyPnl(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        Map<String, Double> monthlyPnl =
                new HashMap<>();

        for (Trade trade : trades) {

            if (trade.getCreatedAt() != null) {

                Month month =
                        trade.getCreatedAt().getMonth();

                String monthName =
                        month.toString();

                double currentPnl =
                        monthlyPnl.getOrDefault(
                                monthName,
                                0.0
                        );

                monthlyPnl.put(
                        monthName,
                        currentPnl + trade.getPnl()
                );
            }
        }

        return monthlyPnl;
    }

    public Map<String, Integer> getStreakAnalytics(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        int currentWinStreak = 0;

        int currentLossStreak = 0;

        int bestWinStreak = 0;

        int tempWinStreak = 0;

        for (Trade trade : trades) {

            if (trade.getPnl() > 0) {

                tempWinStreak++;

                currentWinStreak++;

                currentLossStreak = 0;

            } else if (trade.getPnl() < 0) {

                currentLossStreak++;

                currentWinStreak = 0;

                tempWinStreak = 0;
            }

            if (tempWinStreak > bestWinStreak) {

                bestWinStreak = tempWinStreak;
            }
        }

        Map<String, Integer> data =
                new HashMap<>();

        data.put(
                "currentWinStreak",
                currentWinStreak
        );

        data.put(
                "currentLossStreak",
                currentLossStreak
        );

        data.put(
                "bestWinStreak",
                bestWinStreak
        );

        return data;
    }

    public Map<String, Double> getRiskRewardAnalytics(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        double totalRatio = 0;

        int validTrades = 0;

        for (Trade trade : trades) {

            double risk;

            double reward;

            if (trade.getTradeType().equals("BUY")) {

                risk =
                        trade.getEntryPrice()
                                - trade.getStopLoss();

                reward =
                        trade.getTakeProfit()
                                - trade.getEntryPrice();

            } else {

                risk =
                        trade.getStopLoss()
                                - trade.getEntryPrice();

                reward =
                        trade.getEntryPrice()
                                - trade.getTakeProfit();
            }

            if (risk > 0) {

                double ratio = reward / risk;

                totalRatio += ratio;

                validTrades++;
            }
        }

        double averageRiskReward = 0;

        if (validTrades > 0) {

            averageRiskReward =
                    totalRatio / validTrades;
        }

        Map<String, Double> data =
                new HashMap<>();

        data.put(
                "averageRiskReward",
                averageRiskReward
        );

        return data;
    }

    public Map<String, Double> getDrawdownAnalytics(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        double peak = 0;

        double balance = 0;

        double maxDrawdown = 0;

        for (Trade trade : trades) {

            balance += trade.getPnl();

            if (balance > peak) {

                peak = balance;
            }

            double drawdown = peak - balance;

            if (drawdown > maxDrawdown) {

                maxDrawdown = drawdown;
            }
        }

        Map<String, Double> data =
                new HashMap<>();

        data.put(
                "maxDrawdown",
                maxDrawdown
        );

        return data;
    }
}