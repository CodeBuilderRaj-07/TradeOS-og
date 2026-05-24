package com.TradeOS.analytics;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
class CryptoMarketService {

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl("https://api.binance.com")
                    .build();

    public Map<String, Object> getPrice(
            String symbol
    ) {

        try {

            String rawResponse =
                    webClient.get()

                            .uri("/api/v3/ticker/price?symbol=" + symbol)

                            .accept(MediaType.APPLICATION_JSON)

                            .retrieve()

                            .bodyToMono(String.class)

                            .block();

            ObjectMapper mapper =
                    new ObjectMapper();

            JsonNode jsonNode =
                    mapper.readTree(rawResponse);

            Map<String, Object> result =
                    new HashMap<>();

            result.put(
                    "symbol",
                    jsonNode.get("symbol").asText()
            );

            result.put(
                    "price",
                    jsonNode.get("price").asText()
            );

            return result;

        } catch (Exception e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return error;
        }
    }
}