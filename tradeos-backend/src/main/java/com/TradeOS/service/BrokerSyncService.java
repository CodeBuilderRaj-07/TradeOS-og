package com.TradeOS.service;

import com.TradeOS.dto.MT5TradeUpdateDTO;
import com.TradeOS.entity.Trade;
import com.TradeOS.entity.TradingAccount;
import com.TradeOS.notification.NotificationPublisher;
import com.TradeOS.repository.TradeRepository;
import com.TradeOS.repository.TradingAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class BrokerSyncService {

    private static final Logger log = LoggerFactory.getLogger(BrokerSyncService.class);

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private TradingAccountRepository tradingAccountRepository;

    @Autowired
    private NotificationPublisher notificationPublisher;

    public void processTradeUpdate(MT5TradeUpdateDTO dto) {
        String accountId = dto.getAccountId();
        String ticket = dto.getTicket();
        String status = dto.getStatus();
        String broker = dto.getBroker();
        if (broker == null || broker.isBlank()) broker = "MT5";

        // Find the user who owns this broker account
        TradingAccount brokerAccount = tradingAccountRepository.findByBrokerAndApiKey(broker, accountId);
        if (brokerAccount == null) {
            log.warn("No {} account mapping found for accountId={}. Create a TradingAccount with broker={} and apiKey=accountId.", broker, accountId, broker);
            return;
        }
        String userEmail = brokerAccount.getUserEmail();

        // Look for existing trade by mt5Ticket
        List<Trade> existing = tradeRepository.findByUserEmailAndMt5Ticket(userEmail, ticket);
        Trade trade;

        if ("CLOSED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status)) {
            if (!existing.isEmpty()) {
                trade = existing.get(0);
                trade.setStatus("CLOSED");
                trade.setExitPrice(parseDouble(dto.getClosePrice(), 0));
                trade.setPnl(parseDouble(dto.getProfit(), 0));
                if (dto.getCloseTime() != null && !dto.getCloseTime().isEmpty()) {
                    trade.setCreatedAt(parseDateTime(dto.getCloseTime()));
                }
                tradeRepository.save(trade);
                log.info("Closed {} trade ticket={} for user={}", broker, ticket, userEmail);
                notificationPublisher.pushNotification(
                    "Trade Closed", symbol(trade) + " closed for " + formatPnl(trade.getPnl()),
                    "trade_closed", trade.getSymbol()
                );

                Map<String, Object> closeData = new HashMap<>();
                closeData.put("id", trade.getId());
                closeData.put("symbol", trade.getSymbol());
                closeData.put("pnl", trade.getPnl());
                closeData.put("exitPrice", trade.getExitPrice());
                closeData.put("status", "CLOSED");
                closeData.put("action", "CLOSED");
                notificationPublisher.pushTradeUpdate(closeData);
            }
            return;
        }

        if (!existing.isEmpty()) {
            trade = existing.get(0);
        } else {
            trade = new Trade();
            trade.setMt5Ticket(ticket);
            trade.setMt5AccountId(accountId);
            trade.setUserEmail(userEmail);
            trade.setStatus("OPEN");
            trade.setCreatedAt(LocalDateTime.now());
        }

        trade.setSymbol(dto.getSymbol());
        trade.setTradeType(mapMT5Type(dto.getType()));
        trade.setEntryPrice(parseDouble(dto.getOpenPrice(), 0));
        trade.setStopLoss(parseDouble(dto.getStopLoss(), 0));
        trade.setTakeProfit(parseDouble(dto.getTakeProfit(), 0));
        trade.setPositionSize(parseDouble(dto.getVolume(), 0));
        trade.setPnl(parseDouble(dto.getProfit(), 0));

        if (dto.getOpenTime() != null && !dto.getOpenTime().isEmpty()) {
            trade.setCreatedAt(parseDateTime(dto.getOpenTime()));
        }

        tradeRepository.save(trade);
        log.info("Synced {} trade ticket={} {} {} for user={}", broker, ticket, trade.getSymbol(), trade.getTradeType(), userEmail);

        // Notify frontend
        String type = "OPEN".equalsIgnoreCase(status) ? "trade_opened" : "trade_updated";
        notificationPublisher.pushNotification(
            "Trade " + status, symbol(trade) + " " + trade.getTradeType(),
            type, trade.getSymbol()
        );

        // Push full trade data for real-time UI update
        Map<String, Object> tradeData = new HashMap<>();
        tradeData.put("id", trade.getId());
        tradeData.put("symbol", trade.getSymbol());
        tradeData.put("tradeType", trade.getTradeType());
        tradeData.put("entryPrice", trade.getEntryPrice());
        tradeData.put("stopLoss", trade.getStopLoss());
        tradeData.put("takeProfit", trade.getTakeProfit());
        tradeData.put("positionSize", trade.getPositionSize());
        tradeData.put("pnl", trade.getPnl());
        tradeData.put("status", trade.getStatus());
        tradeData.put("action", status);
        notificationPublisher.pushTradeUpdate(tradeData);
    }

    private String mapMT5Type(String mt5Type) {
        if (mt5Type == null) return "UNKNOWN";
        return switch (mt5Type.toUpperCase(Locale.ROOT)) {
            case "BUY" -> "BUY";
            case "SELL" -> "SELL";
            case "BUY_LIMIT" -> "BUY_LIMIT";
            case "SELL_LIMIT" -> "SELL_LIMIT";
            case "BUY_STOP" -> "BUY_STOP";
            case "SELL_STOP" -> "SELL_STOP";
            default -> mt5Type;
        };
    }

    private double parseDouble(String value, double fallback) {
        if (value == null || value.isEmpty()) return fallback;
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private LocalDateTime parseDateTime(String value) {
        try {
            return LocalDateTime.parse(value, DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss"));
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (Exception e2) {
                return LocalDateTime.now();
            }
        }
    }

    private String symbol(Trade trade) {
        return trade.getSymbol() != null ? trade.getSymbol() : "Unknown";
    }

    private String formatPnl(double pnl) {
        return (pnl >= 0 ? "+" : "") + String.format("%.2f", pnl);
    }
}
