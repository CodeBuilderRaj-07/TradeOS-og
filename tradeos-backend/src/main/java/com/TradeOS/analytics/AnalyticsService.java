package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final TradeRepository tradeRepository;

    public AnalyticsService(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public Map<String, Object> getDashboardSummary(String email) {
        List<Trade> trades = tradeRepository.findByUserEmail(email);
        List<Trade> closedTrades = trades.stream().filter(t -> "CLOSED".equals(t.getStatus())).toList();
        List<Trade> openTradesList = trades.stream().filter(t -> "OPEN".equals(t.getStatus())).toList();

        int totalTrades = trades.size();
        int totalClosed = closedTrades.size();
        int totalOpen = openTradesList.size();

        double totalPnl = 0;
        double grossProfit = 0;
        double grossLoss = 0;
        int wins = 0;
        int losses = 0;
        int breakeven = 0;
        int bestWinStreak = 0;
        int currentWinStreak = 0;
        int currentLossStreak = 0;
        int tempStreak = 0;
        double totalWinPnl = 0;
        double totalLossPnl = 0;

        Map<DayOfWeek, double[]> dayPerformance = new HashMap<>();
        for (DayOfWeek d : DayOfWeek.values()) dayPerformance.put(d, new double[]{0, 0});

        for (Trade t : closedTrades) {
            double pnl = t.getPnl();
            totalPnl += pnl;

            if (pnl > 0) {
                wins++;
                grossProfit += pnl;
                totalWinPnl += pnl;
                tempStreak++;
                currentWinStreak++;
                currentLossStreak = 0;
            } else if (pnl < 0) {
                losses++;
                grossLoss += Math.abs(pnl);
                totalLossPnl += pnl;
                currentLossStreak++;
                currentWinStreak = 0;
                tempStreak = 0;
            } else {
                breakeven++;
                tempStreak = 0;
            }

            if (tempStreak > bestWinStreak) bestWinStreak = tempStreak;

            if (t.getCreatedAt() != null) {
                DayOfWeek dow = t.getCreatedAt().getDayOfWeek();
                double[] perf = dayPerformance.get(dow);
                perf[0]++;         // trade count
                perf[1] += pnl;    // cumulative pnl
            }
        }

        double winRate = totalClosed > 0 ? ((double) wins / totalClosed) * 100 : 0;
        double profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 999 : 0);
        double avgWin = wins > 0 ? totalWinPnl / wins : 0;
        double avgLoss = losses > 0 ? totalLossPnl / losses : 0;
        double avgRMultiple = (avgLoss != 0) ? Math.abs(avgWin / avgLoss) : 0;

        double avgRiskReward = 0;
        int validTrades = 0;
        for (Trade t : trades) {
            double risk;
            double reward;
            if ("BUY".equals(t.getTradeType())) {
                risk = t.getEntryPrice() - t.getStopLoss();
                reward = t.getTakeProfit() - t.getEntryPrice();
            } else {
                risk = t.getStopLoss() - t.getEntryPrice();
                reward = t.getEntryPrice() - t.getTakeProfit();
            }
            if (risk > 0) {
                avgRiskReward += reward / risk;
                validTrades++;
            }
        }
        avgRiskReward = validTrades > 0 ? avgRiskReward / validTrades : 0;

        // Best/worst day of week
        DayOfWeek bestDay = null;
        DayOfWeek worstDay = null;
        double bestDayPnl = Double.NEGATIVE_INFINITY;
        double worstDayPnl = Double.POSITIVE_INFINITY;
        for (Map.Entry<DayOfWeek, double[]> entry : dayPerformance.entrySet()) {
            double pnl = entry.getValue()[1];
            if (pnl > bestDayPnl) { bestDayPnl = pnl; bestDay = entry.getKey(); }
            if (pnl < worstDayPnl) { worstDayPnl = pnl; worstDay = entry.getKey(); }
        }

        // TradeOS Score (composite 0-100, inspired by Zella Score)
        double tradeosScore = computeTradeosScore(winRate, profitFactor, avgRMultiple, totalClosed, bestWinStreak, wins, losses);

        Map<String, Object> data = new HashMap<>();
        data.put("winningTrades", wins);
        data.put("losingTrades", losses);
        data.put("breakevenTrades", breakeven);
        data.put("totalTrades", totalTrades);
        data.put("closedTrades", totalClosed);
        data.put("openTrades", totalOpen);
        data.put("winRate", Math.round(winRate * 10.0) / 10.0);
        data.put("totalPnl", Math.round(totalPnl * 100.0) / 100.0);
        data.put("balance", Math.round(totalPnl * 100.0) / 100.0);
        data.put("initialBalance", 0);
        data.put("accountName", "");
        data.put("profitFactor", Math.round(profitFactor * 100.0) / 100.0);
        data.put("avgWin", Math.round(avgWin * 100.0) / 100.0);
        data.put("avgLoss", Math.round(avgLoss * 100.0) / 100.0);
        data.put("avgRMultiple", Math.round(avgRMultiple * 100.0) / 100.0);
        data.put("avgRiskReward", Math.round(avgRiskReward * 100.0) / 100.0);
        data.put("bestWinStreak", bestWinStreak);
        data.put("currentWinStreak", currentWinStreak);
        data.put("currentLossStreak", currentLossStreak);
        data.put("grossProfit", Math.round(grossProfit * 100.0) / 100.0);
        data.put("grossLoss", Math.round(grossLoss * 100.0) / 100.0);
        data.put("tradeosScore", tradeosScore);

        if (bestDay != null) {
            data.put("bestDay", bestDay.toString());
            data.put("bestDayPnl", Math.round(bestDayPnl * 100.0) / 100.0);
        }
        if (worstDay != null) {
            data.put("worstDay", worstDay.toString());
            data.put("worstDayPnl", Math.round(worstDayPnl * 100.0) / 100.0);
        }

        return data;
    }

    private double computeTradeosScore(double winRate, double profitFactor, double avgRMultiple,
                                        int totalClosed, int bestWinStreak, int wins, int losses) {
        double score = 0;
        int totalWL = wins + losses;

        // 1. Win rate (max 25 points) — sigmoid-like curve, rewards 50-80% range
        if (winRate >= 70) score += 25;
        else if (winRate >= 60) score += 22;
        else if (winRate >= 50) score += 18;
        else if (winRate >= 40) score += 12;
        else if (winRate >= 30) score += 6;
        else score += 2;

        // 2. Profit factor (max 25 points)
        if (profitFactor >= 4) score += 25;
        else if (profitFactor >= 3) score += 22;
        else if (profitFactor >= 2) score += 18;
        else if (profitFactor >= 1.5) score += 12;
        else if (profitFactor >= 1) score += 6;

        // 3. R-Multiple (max 15 points) — diminishing returns above 2
        score += Math.min(15, avgRMultiple * 7);
        if (avgRMultiple > 2) score = Math.min(score, score - (avgRMultiple - 2) * 1.5);

        // 4. Sample size confidence (max 15 points)
        if (totalClosed >= 200) score += 15;
        else if (totalClosed >= 100) score += 13;
        else if (totalClosed >= 50) score += 10;
        else if (totalClosed >= 25) score += 7;
        else if (totalClosed >= 10) score += 4;
        else score += 1;

        // 5. Consistency — streak component (max 10 points)
        if (bestWinStreak >= 10) score += 10;
        else if (bestWinStreak >= 7) score += 8;
        else if (bestWinStreak >= 5) score += 6;
        else if (bestWinStreak >= 3) score += 4;
        else if (bestWinStreak >= 1) score += 2;

        // 6. Win/loss balance with penalty for extreme ratios (max 10 points)
        if (totalWL > 0) {
            double wlRatio = (double) wins / Math.max(1, losses);
            if (wlRatio >= 3) score += 10;
            else if (wlRatio >= 2) score += 8;
            else if (wlRatio >= 1.5) score += 6;
            else if (wlRatio >= 1) score += 4;
            else if (wlRatio >= 0.5) score += 2;
        }

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    public Map<String, Double> getMonthlyPnl(String email) {
        List<Trade> trades = tradeRepository.findByUserEmail(email);
        Map<String, Double> monthlyPnl = new HashMap<>();
        for (Trade trade : trades) {
            if (trade.getCreatedAt() != null) {
                Month month = trade.getCreatedAt().getMonth();
                String monthName = month.toString();
                double currentPnl = monthlyPnl.getOrDefault(monthName, 0.0);
                monthlyPnl.put(monthName, currentPnl + trade.getPnl());
            }
        }
        return monthlyPnl;
    }

    public Map<String, Integer> getStreakAnalytics(String email) {
        List<Trade> trades = tradeRepository.findByUserEmail(email);
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
            if (tempWinStreak > bestWinStreak) bestWinStreak = tempWinStreak;
        }

        Map<String, Integer> data = new HashMap<>();
        data.put("currentWinStreak", currentWinStreak);
        data.put("currentLossStreak", currentLossStreak);
        data.put("bestWinStreak", bestWinStreak);
        return data;
    }

    public Map<String, Double> getRiskRewardAnalytics(String email) {
        List<Trade> trades = tradeRepository.findByUserEmail(email);
        double totalRatio = 0;
        int validTrades = 0;
        for (Trade trade : trades) {
            double risk;
            double reward;
            if ("BUY".equals(trade.getTradeType())) {
                risk = trade.getEntryPrice() - trade.getStopLoss();
                reward = trade.getTakeProfit() - trade.getEntryPrice();
            } else {
                risk = trade.getStopLoss() - trade.getEntryPrice();
                reward = trade.getEntryPrice() - trade.getTakeProfit();
            }
            if (risk > 0) {
                totalRatio += reward / risk;
                validTrades++;
            }
        }
        double averageRiskReward = validTrades > 0 ? totalRatio / validTrades : 0;
        Map<String, Double> data = new HashMap<>();
        data.put("averageRiskReward", averageRiskReward);
        return data;
    }

    public Map<String, Double> getDrawdownAnalytics(String email) {
        List<Trade> trades = tradeRepository.findByUserEmail(email);
        double peak = 0;
        double balance = 0;
        double maxDrawdown = 0;
        for (Trade trade : trades) {
            balance += trade.getPnl();
            if (balance > peak) peak = balance;
            double drawdown = peak - balance;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        }
        Map<String, Double> data = new HashMap<>();
        data.put("maxDrawdown", maxDrawdown);
        return data;
    }

    public Map<String, Map<String, Object>> getPerformanceBySymbol(String email) {
        List<Trade> trades = tradeRepository.findByUserEmail(email);
        Map<String, Map<String, Object>> bySymbol = new HashMap<>();

        for (Trade trade : trades) {
            String symbol = trade.getSymbol();
            if (symbol == null || symbol.isBlank()) continue;

            bySymbol.putIfAbsent(symbol, new HashMap<>());
            Map<String, Object> symData = bySymbol.get(symbol);

            double pnl = trade.getPnl();
            symData.merge("totalPnl", pnl, (a, b) -> ((Double) a) + (Double) b);
            symData.merge("trades", 1, (a, b) -> ((Integer) a) + (Integer) b);

            if (pnl > 0) {
                symData.merge("wins", 1, (a, b) -> ((Integer) a) + (Integer) b);
            } else if (pnl < 0) {
                symData.merge("losses", 1, (a, b) -> ((Integer) a) + (Integer) b);
            }
        }

        for (Map.Entry<String, Map<String, Object>> entry : bySymbol.entrySet()) {
            Map<String, Object> data = entry.getValue();
            data.putIfAbsent("wins", 0);
            data.putIfAbsent("losses", 0);
            int wins = (int) data.get("wins");
            int losses = (int) data.get("losses");
            int total = wins + losses;
            data.put("totalTrades", total);
            data.put("winRate", total > 0 ? Math.round((double) wins / total * 1000.0) / 10.0 : 0);
        }

        return bySymbol;
    }
}
