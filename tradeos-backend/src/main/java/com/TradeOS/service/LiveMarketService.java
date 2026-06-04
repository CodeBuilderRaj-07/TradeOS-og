package com.TradeOS.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class LiveMarketService {

    @Value("${twelvedata.api.key}")
    private String apiKey;

    @Value("${gold.api.key}")
    private String goldApiKey;

    private final RestTemplate restTemplate =
            new RestTemplate();

    private static final Map<String, String> CRYPTO_EXCHANGES = new HashMap<>();
    static {
        CRYPTO_EXCHANGES.put("BTCUSDT", "BTCUSDT");
        CRYPTO_EXCHANGES.put("ETHUSD", "ETHUSDT");
        CRYPTO_EXCHANGES.put("BNBUSD", "BNBUSDT");
        CRYPTO_EXCHANGES.put("SOLUSD", "SOLUSDT");
        CRYPTO_EXCHANGES.put("XRPUSD", "XRPUSDT");
    }

    public Double getPriceForSymbol(String symbol) {
        try {
            String upper = symbol.toUpperCase();

            if ("XAUUSD".equals(upper) && goldApiKey != null && !goldApiKey.isBlank() && !goldApiKey.contains("YOUR_")) {
                try {
                    String goldUrl;
                    if (goldApiKey.contains("goldapi")) {
                        goldUrl = "https://www.goldapi.io/api/XAU/USD";
                        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                        headers.set("x-access-token", goldApiKey);
                        org.springframework.http.HttpEntity<?> entity = new org.springframework.http.HttpEntity<>(headers);
                        org.springframework.http.ResponseEntity<Map> response = restTemplate.exchange(
                                goldUrl, org.springframework.http.HttpMethod.GET, entity, Map.class
                        );
                        Map goldResponse = response.getBody();
                        if (goldResponse != null && goldResponse.containsKey("price")) {
                            return Double.parseDouble(goldResponse.get("price").toString());
                        }
                    } else {
                        goldUrl = "https://api.goldprice.dev/v1/prices?symbols=XAU-USD-SPOT";
                        Map goldResponse = restTemplate.getForObject(goldUrl, Map.class);
                        if (goldResponse != null && goldResponse.containsKey("price")) {
                            return Double.parseDouble(goldResponse.get("price").toString());
                        }
                    }
                } catch (Exception ignored) {}
            }

            if (CRYPTO_EXCHANGES.containsKey(upper)) {
                String binanceSymbol = CRYPTO_EXCHANGES.get(upper);
                String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + binanceSymbol;
                Map response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.get("price") != null) {
                    return Double.parseDouble(response.get("price").toString());
                }
            }

            String twelveDataSymbol = formatForTwelveData(upper);
            String url = "https://api.twelvedata.com/price?symbol=" + twelveDataSymbol + "&apikey=" + apiKey;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.get("price") != null) {
                return Double.parseDouble(response.get("price").toString());
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private String formatForTwelveData(String symbol) {
        if (symbol.length() >= 6) {
            int split = symbol.length() - 3;
            return symbol.substring(0, split) + "/" + symbol.substring(split);
        }
        return symbol;
    }

    public Map<String, Object> getMarketPrices() {

        Map<String, Object> result =
                new HashMap<>();

        String[] symbols = {"XAUUSD", "EURUSD", "BTCUSDT"};
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