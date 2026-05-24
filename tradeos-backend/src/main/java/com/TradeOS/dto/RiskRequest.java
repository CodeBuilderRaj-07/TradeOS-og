package com.TradeOS.dto;

public class RiskRequest {

    private double accountBalance;

    private double riskPercentage;

    private double entryPrice;

    private double stopLoss;

    public double getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(
            double accountBalance
    ) {
        this.accountBalance = accountBalance;
    }

    public double getRiskPercentage() {
        return riskPercentage;
    }

    public void setRiskPercentage(
            double riskPercentage
    ) {
        this.riskPercentage = riskPercentage;
    }

    public double getEntryPrice() {
        return entryPrice;
    }

    public void setEntryPrice(
            double entryPrice
    ) {
        this.entryPrice = entryPrice;
    }

    public double getStopLoss() {
        return stopLoss;
    }

    public void setStopLoss(
            double stopLoss
    ) {
        this.stopLoss = stopLoss;
    }
}