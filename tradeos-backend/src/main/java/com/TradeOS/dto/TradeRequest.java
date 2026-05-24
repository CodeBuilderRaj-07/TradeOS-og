package com.TradeOS.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class TradeRequest {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Trade type is required")
    private String tradeType;

    @Min(value = 1, message = "Entry price must be positive")
    private double entryPrice;

    private double exitPrice;

    @Min(value = 1, message = "Stop loss must be positive")
    private double stopLoss;

    @Min(value = 1, message = "Take profit must be positive")
    private double takeProfit;

    @Min(value = 1, message = "Position size must be positive")
    private double positionSize;

    private double pnl;

    private String status;

    private String notes;

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getTradeType() {
        return tradeType;
    }

    public void setTradeType(String tradeType) {
        this.tradeType = tradeType;
    }

    public double getEntryPrice() {
        return entryPrice;
    }

    public void setEntryPrice(double entryPrice) {
        this.entryPrice = entryPrice;
    }

    public double getExitPrice() {
        return exitPrice;
    }

    public void setExitPrice(double exitPrice) {
        this.exitPrice = exitPrice;
    }

    public double getStopLoss() {
        return stopLoss;
    }

    public void setStopLoss(double stopLoss) {
        this.stopLoss = stopLoss;
    }

    public double getTakeProfit() {
        return takeProfit;
    }

    public void setTakeProfit(double takeProfit) {
        this.takeProfit = takeProfit;
    }

    public double getPositionSize() {
        return positionSize;
    }

    public void setPositionSize(double positionSize) {
        this.positionSize = positionSize;
    }

    public double getPnl() {
        return pnl;
    }

    public void setPnl(double pnl) {
        this.pnl = pnl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}