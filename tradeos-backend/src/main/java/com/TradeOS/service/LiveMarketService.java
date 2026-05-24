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

    private final RestTemplate restTemplate =
            new RestTemplate();

    public Map<String, Object> getMarketPrices() {

        Map<String, Object> result =
                new HashMap<>();

        try {

            String goldUrl =
                    "https://api.twelvedata.com/price?symbol=XAU/USD&apikey="
                            + apiKey;

            String eurusdUrl =
                    "https://api.twelvedata.com/price?symbol=EUR/USD&apikey="
                            + apiKey;

            String btcUrl =
                    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";

            Map goldResponse =
                    restTemplate.getForObject(
                            goldUrl,
                            Map.class
                    );

            Map eurusdResponse =
                    restTemplate.getForObject(
                            eurusdUrl,
                            Map.class
                    );

            Map btcResponse =
                    restTemplate.getForObject(
                            btcUrl,
                            Map.class
                    );

            result.put(
                    "XAUUSD",
                    goldResponse.get("price")
            );

            result.put(
                    "EURUSD",
                    eurusdResponse.get("price")
            );

            result.put(
                    "BTCUSDT",
                    btcResponse.get("price")
            );

        } catch (Exception e) {

            result.put(
                    "error",
                    e.getMessage()
            );
        }

        return result;
    }
}