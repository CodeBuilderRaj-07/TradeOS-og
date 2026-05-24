package com.TradeOS.controller;

import com.TradeOS.service.LiveMarketService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketDataController {

    @Autowired
    private LiveMarketService liveMarketService;

    @GetMapping("/prices")
    public Map<String, Object> getPrices() {

        return liveMarketService
                .getMarketPrices();
    }
}