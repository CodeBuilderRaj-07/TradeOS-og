package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TradeJournalAiService {

    @Autowired
    private TradeRepository tradeRepository;

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl("https://openrouter.ai/api")
                    .build();

    public Map<String, String> analyzeJournal(
            String email
    ) {

        try {

            List<Trade> trades =
                    tradeRepository.findByUserEmail(email);

            StringBuilder notes =
                    new StringBuilder();

            for (Trade trade : trades) {

                if (trade.getNotes() != null) {

                    notes.append(
                            trade.getNotes()
                    );

                    notes.append("\n");
                }
            }

            String prompt =
                    "Analyze this trader journal and give psychology + discipline advice:\n"
                            + notes;

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

            ObjectMapper mapper =
                    new ObjectMapper();

            JsonNode jsonNode =
                    mapper.readTree(rawResponse);

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
                    "journalAnalysis",
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