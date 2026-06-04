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
        return liveMarketService.getMarketPrices();
    }

    @GetMapping("/price/{symbol}")
    public Map<String, Object> getPriceForSymbol(
            @PathVariable String symbol
    ) {
        Map<String, Object> result = new java.util.HashMap<>();
        Double price = liveMarketService.getPriceForSymbol(symbol);
        if (price != null) {
            result.put("symbol", symbol.toUpperCase());
            result.put("price", price);
        } else {
            result.put("symbol", symbol.toUpperCase());
            result.put("price", null);
            result.put("error", "Unable to fetch price for " + symbol);
        }
        return result;
    }
}