package com.TradeOS.dto;

import jakarta.validation.constraints.Positive;

public class CloseTradeRequest {

    @Positive(message = "Exit price must be positive")
    private Double exitPrice;

    public Double getExitPrice() {
        return exitPrice;
    }

    public void setExitPrice(Double exitPrice) {
        this.exitPrice = exitPrice;
    }
}