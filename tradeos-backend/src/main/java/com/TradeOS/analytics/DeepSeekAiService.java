package com.TradeOS.analytics;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
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
                      "model": "deepseek/deepseek-v4-flash:free",
                      "messages": [
                        {
                          "role": "user",
                          "content": "%s"
                        }
                      ]
                    }
                    """.formatted(prompt.replace("\"", "\\\""));

            return executeRequest(requestBody);

        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    public Map<String, String> chat(
            List<Map<String, String>> messages
    ) {
        try {

            StringBuilder messagesJson = new StringBuilder("[");
            for (int i = 0; i < messages.size(); i++) {
                Map<String, String> msg = messages.get(i);
                String role = msg.getOrDefault("role", "user");
                String content = msg.getOrDefault("content", "").replace("\"", "\\\"");
                messagesJson.append(String.format(
                        "{\"role\": \"%s\", \"content\": \"%s\"}",
                        role, content
                ));
                if (i < messages.size() - 1) {
                    messagesJson.append(",");
                }
            }
            messagesJson.append("]");

            String requestBody = String.format(
                    "{\"model\": \"deepseek/deepseek-v4-flash:free\", \"messages\": %s}",
                    messagesJson.toString()
            );

            return executeRequest(requestBody);

        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    private Map<String, String> executeRequest(String requestBody) {
        try {
            String rawResponse =
                    webClient.post()
                            .uri("/v1/chat/completions")
                            .header("Authorization", "Bearer " + apiKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(requestBody)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(rawResponse);
            String aiMessage = jsonNode
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

            Map<String, String> result = new HashMap<>();
            result.put("response", aiMessage);
            return result;

        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    private Map<String, String> errorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return error;
    }
}