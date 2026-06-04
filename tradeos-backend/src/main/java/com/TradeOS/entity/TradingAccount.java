package com.TradeOS.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trading_accounts")
public class TradingAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String broker;
    private String type;
    private String apiKey;
    private String apiSecret;
    private String currency;
    private String leverage;
    private double initialBalance;
    private double currentBalance;
    private double maxDailyLoss;
    private int maxTradesPerDay;
    private double defaultRisk;
    private boolean active;
    private String userEmail;
    private LocalDateTime createdAt;

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBroker() { return broker; }
    public void setBroker(String broker) { this.broker = broker; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getApiSecret() { return apiSecret; }
    public void setApiSecret(String apiSecret) { this.apiSecret = apiSecret; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getLeverage() { return leverage; }
    public void setLeverage(String leverage) { this.leverage = leverage; }

    public double getInitialBalance() { return initialBalance; }
    public void setInitialBalance(double initialBalance) { this.initialBalance = initialBalance; }

    public double getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(double currentBalance) { this.currentBalance = currentBalance; }

    public double getMaxDailyLoss() { return maxDailyLoss; }
    public void setMaxDailyLoss(double maxDailyLoss) { this.maxDailyLoss = maxDailyLoss; }

    public int getMaxTradesPerDay() { return maxTradesPerDay; }
    public void setMaxTradesPerDay(int maxTradesPerDay) { this.maxTradesPerDay = maxTradesPerDay; }

    public double getDefaultRisk() { return defaultRisk; }
    public void setDefaultRisk(double defaultRisk) { this.defaultRisk = defaultRisk; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
