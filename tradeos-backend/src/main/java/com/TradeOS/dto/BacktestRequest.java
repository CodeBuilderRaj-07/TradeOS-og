package com.TradeOS.dto;

public class BacktestRequest {

    private int totalTrades;

    private double winRate;

    private double riskRewardRatio;

    public int getTotalTrades() {
        return totalTrades;
    }

    public void setTotalTrades(
            int totalTrades
    ) {
        this.totalTrades = totalTrades;
    }

    public double getWinRate() {
        return winRate;
    }

    public void setWinRate(
            double winRate
    ) {
        this.winRate = winRate;
    }

    public double getRiskRewardRatio() {
        return riskRewardRatio;
    }

    public void setRiskRewardRatio(
            double riskRewardRatio
    ) {
        this.riskRewardRatio = riskRewardRatio;
    }
}