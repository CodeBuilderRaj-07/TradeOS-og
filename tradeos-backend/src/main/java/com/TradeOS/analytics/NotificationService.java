package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private DeepSeekAiService deepSeekAiService;

    public Map<String, String> sendNotification(
            String type
    ) {
        String message = generateMessage(type, null);
        Map<String, String> result = new HashMap<>();
        result.put("notification", message);
        return result;
    }

    public String generateAiNotification(Trade trade, String touchType) {
        String direction = trade.getTradeType();
        String symbol = trade.getSymbol();
        double entry = trade.getEntryPrice();
        double sl = trade.getStopLoss();
        double tp = trade.getTakeProfit();

        String prompt = String.format(
                "You are a trading assistant. Generate a short, professional notification (max 2 sentences) " +
                "informing the trader that their %s trade on %s has been %s touched. " +
                "Entry: %.5f, Stop Loss: %.5f, Take Profit: %.5f. " +
                "Keep it concise and avoid markdown.",
                direction, symbol, touchType, entry, sl, tp
        );

        try {
            Map<String, String> aiResponse = deepSeekAiService.askAi(prompt);
            return aiResponse.getOrDefault("response", generateFallbackMessage(symbol, touchType));
        } catch (Exception e) {
            return generateFallbackMessage(symbol, touchType);
        }
    }

    private String generateFallbackMessage(String symbol, String touchType) {
        switch (touchType.toLowerCase()) {
            case "tp": return symbol + " hit your take profit target. Well managed!";
            case "sl": return symbol + " hit your stop loss. Review the trade.";
            case "breakeven": return symbol + " moved to breakeven. Consider managing risk.";
            default: return symbol + " trade updated.";
        }
    }

    private String generateMessage(String type, Trade trade) {
        if (trade != null) {
            return generateAiNotification(trade, type);
        }
        switch (type.toLowerCase()) {
            case "profit":
            case "tp":
                return "Great job! Your trade hit profit target.";
            case "loss":
            case "sl":
                return "Warning: Your trade closed in loss. Review your strategy.";
            case "risk":
                return "Risk warning: You are exceeding safe risk limits.";
            case "breakeven":
                return "Trade moved to breakeven. Manage your position.";
            default:
                return "TradeOS notification triggered.";
        }
    }
}