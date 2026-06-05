package com.TradeOS.controller;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private TradeRepository tradeRepository;

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder().baseUrl("https://openrouter.ai/api").build();

    @PostMapping("/analyze")
    public ObjectNode analyze(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode result = mapper.createObjectNode();

        try {
            List<Trade> trades = tradeRepository.findByUserEmail(email);
            long closedCount = trades.stream().filter(t -> "CLOSED".equals(t.getStatus())).count();

            if (closedCount < 3) {
                result.put("performanceSummary", "Not enough data. Log at least 3 closed trades to get AI analysis.");
                result.put("behavioralPatterns", "Insufficient behavioral data.");
                result.put("riskManagement", "Insufficient risk data.");
                ArrayNode recs = result.putArray("recommendations");
                recs.add("Log more trades for personalized recommendations.");
                result.put("disciplineScore", 0);
                return result;
            }

            StringBuilder notes = new StringBuilder();
            for (Trade trade : trades) {
                if (trade.getNotes() != null) {
                    notes.append(trade.getNotes()).append("\n");
                }
            }

            String prompt = "You are a trading coach. Analyze the following trade journal and return a JSON object with exactly these keys: performanceSummary (string), behavioralPatterns (string), riskManagement (string), recommendations (array of strings), disciplineScore (number 0-100). Only return valid JSON, no markdown.\n\nJournal entries:\n" + notes;

            String requestBody = "{\"model\":\"deepseek/deepseek-chat\",\"messages\":[{\"role\":\"user\",\"content\":" + mapper.writeValueAsString(prompt) + "}]}";

            String rawResponse = webClient.post()
                    .uri("/v1/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = mapper.readTree(rawResponse);
            String aiMessage = jsonNode.get("choices").get(0).get("message").get("content").asText();

            try {
                JsonNode parsed = mapper.readTree(aiMessage);
                result.put("performanceSummary", parsed.has("performanceSummary") ? parsed.get("performanceSummary").asText() : "Analysis completed.");
                result.put("behavioralPatterns", parsed.has("behavioralPatterns") ? parsed.get("behavioralPatterns").asText() : "Review your trade journal.");
                result.put("riskManagement", parsed.has("riskManagement") ? parsed.get("riskManagement").asText() : "Review your risk management.");
                if (parsed.has("recommendations") && parsed.get("recommendations").isArray()) {
                    result.set("recommendations", parsed.get("recommendations"));
                } else {
                    ArrayNode recs = result.putArray("recommendations");
                    recs.add("Continue logging your trades for better insights.");
                }
                result.put("disciplineScore", parsed.has("disciplineScore") ? parsed.get("disciplineScore").asInt() : 50);
            } catch (Exception e) {
                result.put("performanceSummary", aiMessage);
                result.put("behavioralPatterns", "Parsing fallback.");
                result.put("riskManagement", "Parsing fallback.");
                ArrayNode recs = result.putArray("recommendations");
                recs.add("Review the analysis above.");
                result.put("disciplineScore", 50);
            }
        } catch (Exception e) {
            result.put("performanceSummary", "AI service unavailable. Please try again later.");
            result.put("behavioralPatterns", "Service unavailable.");
            result.put("riskManagement", "Service unavailable.");
            ArrayNode recs = result.putArray("recommendations");
            recs.add("Check your API key configuration.");
            result.put("disciplineScore", 0);
        }
        return result;
    }
}
