package com.TradeOS.dto;

import jakarta.validation.constraints.Min;

public class UpdateTradeRequest {

    private String symbol;

    @Min(value = 0, message = "Entry price must be positive")
    private double entryPrice;

    private double stopLoss;

    private double takeProfit;

    private String notes;

    private double riskPct;

    private String session;

    private String strategy;

    private String timeframe;

    private String confidence;

    private double positionSize;

    private String tags;

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public double getEntryPrice() { return entryPrice; }
    public void setEntryPrice(double entryPrice) { this.entryPrice = entryPrice; }

    public double getStopLoss() { return stopLoss; }
    public void setStopLoss(double stopLoss) { this.stopLoss = stopLoss; }

    public double getTakeProfit() { return takeProfit; }
    public void setTakeProfit(double takeProfit) { this.takeProfit = takeProfit; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public double getRiskPct() { return riskPct; }
    public void setRiskPct(double riskPct) { this.riskPct = riskPct; }

    public String getSession() { return session; }
    public void setSession(String session) { this.session = session; }

    public String getStrategy() { return strategy; }
    public void setStrategy(String strategy) { this.strategy = strategy; }

    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }

    public double getPositionSize() { return positionSize; }
    public void setPositionSize(double positionSize) { this.positionSize = positionSize; }
}
