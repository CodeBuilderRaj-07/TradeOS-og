package com.TradeOS.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class LiveMarketService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Map<String, String> CRYPTO_TO_BINANCE = new HashMap<>();
    static {
        CRYPTO_TO_BINANCE.put("BTCUSD", "BTCUSDT");
        CRYPTO_TO_BINANCE.put("ETHUSD", "ETHUSDT");
        CRYPTO_TO_BINANCE.put("BNBUSD", "BNBUSDT");
        CRYPTO_TO_BINANCE.put("SOLUSD", "SOLUSDT");
        CRYPTO_TO_BINANCE.put("XRPUSD", "XRPUSDT");
    }

    private static final Map<String, String> FOREX_TO_ERAPI = new HashMap<>();
    static {
        FOREX_TO_ERAPI.put("EURUSD", "EUR");
        FOREX_TO_ERAPI.put("GBPUSD", "GBP");
        FOREX_TO_ERAPI.put("USDJPY", "JPY");
        FOREX_TO_ERAPI.put("USDCHF", "CHF");
        FOREX_TO_ERAPI.put("AUDUSD", "AUD");
        FOREX_TO_ERAPI.put("NZDUSD", "NZD");
        FOREX_TO_ERAPI.put("USDCAD", "CAD");
        FOREX_TO_ERAPI.put("EURGBP", "EUR");
        FOREX_TO_ERAPI.put("EURJPY", "EUR");
        FOREX_TO_ERAPI.put("GBPJPY", "GBP");
    }

    public Double getPriceForSymbol(String symbol) {
        try {
            String upper = symbol.toUpperCase();

            // 1. Gold / Silver via gold-api.com (free, no key)
            if ("XAUUSD".equals(upper)) {
                return fetchMetalPrice("XAU");
            }
            if ("XAGUSD".equals(upper)) {
                return fetchMetalPrice("XAG");
            }

            // 2. Crypto via Binance (free, no key)
            if (CRYPTO_TO_BINANCE.containsKey(upper)) {
                String binanceSymbol = CRYPTO_TO_BINANCE.get(upper);
                String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + binanceSymbol;
                Map response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.get("price") != null) {
                    return Double.parseDouble(response.get("price").toString());
                }
            }

            // 3. Forex via exchange-rate API (free, no key)
            if (FOREX_TO_ERAPI.containsKey(upper)) {
                return fetchForexRate(upper);
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private Double fetchMetalPrice(String metal) {
        try {
            String url = "https://api.gold-api.com/price/" + metal;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("price")) {
                return Double.parseDouble(response.get("price").toString());
            }
        } catch (Exception ignored) {}
        return null;
    }

    private Double fetchForexRate(String pair) {
        try {
            String base = pair.substring(0, 3);
            String quote = pair.substring(3);
            String url = "https://open.er-api.com/v6/latest/" + base;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("rates")) {
                Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                if (rates != null && rates.containsKey(quote)) {
                    return Double.parseDouble(rates.get(quote).toString());
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    public Map<String, Object> getMarketPrices() {
        Map<String, Object> result = new HashMap<>();
        String[] symbols = {"XAUUSD", "EURUSD", "BTCUSD"};
        for (String sym : symbols) {
            Double price = getPriceForSymbol(sym);
            if (price != null) {
                result.put(sym, price);
            }
        }
        if (result.isEmpty()) {
            result.put("error", "Failed to fetch any market prices");
        }
        return result;
    }
}
