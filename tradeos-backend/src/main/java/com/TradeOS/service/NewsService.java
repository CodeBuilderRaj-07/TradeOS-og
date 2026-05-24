package com.TradeOS.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class NewsService {

    @Value("${news.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate =
            new RestTemplate();

    public Map getCryptoNews() {

        String url =
                "https://newsapi.org/v2/everything?q=crypto OR bitcoin OR forex&sortBy=publishedAt&language=en&apiKey="
                        + apiKey;

        return restTemplate.getForObject(
                url,
                Map.class
        );
    }
}