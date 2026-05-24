package com.TradeOS.analytics;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class DeepSeekAiService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl("https://openrouter.ai/api")
                    .build();

    public Map<String, String> askAi(
            String prompt
    ) {

        try {

            String requestBody =
                    """
                    {
                      "model": "deepseek/deepseek-chat",
                      "messages": [
                        {
                          "role": "user",
                          "content": "%s"
                        }
                      ]
                    }
                    """.formatted(prompt);

            String rawResponse =
                    webClient.post()

                            .uri("/v1/chat/completions")

                            .header(
                                    "Authorization",
                                    "Bearer " + apiKey
                            )

                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )

                            .bodyValue(requestBody)

                            .retrieve()

                            .bodyToMono(String.class)

                            .block();

            ObjectMapper objectMapper =
                    new ObjectMapper();

            JsonNode jsonNode =
                    objectMapper.readTree(rawResponse);

            String aiMessage =
                    jsonNode

                            .get("choices")
                            .get(0)

                            .get("message")

                            .get("content")

                            .asText();

            Map<String, String> result =
                    new HashMap<>();

            result.put(
                    "response",
                    aiMessage
            );

            return result;

        } catch (Exception e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return error;
        }
    }
}