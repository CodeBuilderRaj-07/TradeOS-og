package com.TradeOS.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class MT5TradeUpdateDTO {

    private String ticket;

    @JsonAlias({"accountId", "account_id"})
    private String accountId;

    @JsonAlias({"broker"})
    private String broker;

    private String symbol;
    private String type;

    @JsonAlias({"openPrice", "open_price"})
    private String openPrice;

    @JsonAlias({"currentPrice", "current_price"})
    private String currentPrice;

    @JsonAlias({"stopLoss", "stop_loss"})
    private String stopLoss;

    @JsonAlias({"takeProfit", "take_profit"})
    private String takeProfit;

    private String profit;
    private String swap;
    private String commission;

    @JsonAlias({"openTime", "open_time"})
    private String openTime;

    @JsonAlias({"closePrice", "close_price"})
    private String closePrice;

    @JsonAlias({"closeTime", "close_time"})
    private String closeTime;

    private String status;
    private String comment;
    private String magic;
    private String volume;

    public String getTicket() { return ticket; }
    public void setTicket(String ticket) { this.ticket = ticket; }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getBroker() { return broker; }
    public void setBroker(String broker) { this.broker = broker; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }

    public String getOpenPrice() { return openPrice; }
    public void setOpenPrice(String openPrice) { this.openPrice = openPrice; }

    public String getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(String currentPrice) { this.currentPrice = currentPrice; }

    public String getStopLoss() { return stopLoss; }
    public void setStopLoss(String stopLoss) { this.stopLoss = stopLoss; }

    public String getTakeProfit() { return takeProfit; }
    public void setTakeProfit(String takeProfit) { this.takeProfit = takeProfit; }

    public String getProfit() { return profit; }
    public void setProfit(String profit) { this.profit = profit; }

    public String getSwap() { return swap; }
    public void setSwap(String swap) { this.swap = swap; }

    public String getCommission() { return commission; }
    public void setCommission(String commission) { this.commission = commission; }

    public String getOpenTime() { return openTime; }
    public void setOpenTime(String openTime) { this.openTime = openTime; }

    public String getClosePrice() { return closePrice; }
    public void setClosePrice(String closePrice) { this.closePrice = closePrice; }

    public String getCloseTime() { return closeTime; }
    public void setCloseTime(String closeTime) { this.closeTime = closeTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getMagic() { return magic; }
    public void setMagic(String magic) { this.magic = magic; }
}
