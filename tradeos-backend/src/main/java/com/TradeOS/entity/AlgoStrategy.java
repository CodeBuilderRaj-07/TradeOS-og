package com.TradeOS.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "algo_strategies")
public class AlgoStrategy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String symbol;
    private String tradeDirection;
    private String entryTrigger;
    private double entryValue;
    private double stopLoss;
    private double takeProfit;
    private double positionSize;
    private int maxActiveTrades;
    private double maxDailyLoss;
    private boolean active;
    private String status;
    private Long tradingAccountId;
    private String userEmail;
    private LocalDateTime createdAt;

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getTradeDirection() { return tradeDirection; }
    public void setTradeDirection(String tradeDirection) { this.tradeDirection = tradeDirection; }

    public String getEntryTrigger() { return entryTrigger; }
    public void setEntryTrigger(String entryTrigger) { this.entryTrigger = entryTrigger; }

    public double getEntryValue() { return entryValue; }
    public void setEntryValue(double entryValue) { this.entryValue = entryValue; }

    public double getStopLoss() { return stopLoss; }
    public void setStopLoss(double stopLoss) { this.stopLoss = stopLoss; }

    public double getTakeProfit() { return takeProfit; }
    public void setTakeProfit(double takeProfit) { this.takeProfit = takeProfit; }

    public double getPositionSize() { return positionSize; }
    public void setPositionSize(double positionSize) { this.positionSize = positionSize; }

    public int getMaxActiveTrades() { return maxActiveTrades; }
    public void setMaxActiveTrades(int maxActiveTrades) { this.maxActiveTrades = maxActiveTrades; }

    public double getMaxDailyLoss() { return maxDailyLoss; }
    public void setMaxDailyLoss(double maxDailyLoss) { this.maxDailyLoss = maxDailyLoss; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getTradingAccountId() { return tradingAccountId; }
    public void setTradingAccountId(Long tradingAccountId) { this.tradingAccountId = tradingAccountId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
