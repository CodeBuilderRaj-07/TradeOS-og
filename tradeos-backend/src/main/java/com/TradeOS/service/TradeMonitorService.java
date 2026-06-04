package com.TradeOS.service;

import com.TradeOS.analytics.NotificationService;
import com.TradeOS.entity.Trade;
import com.TradeOS.notification.NotificationPublisher;
import com.TradeOS.repository.TradeRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradeMonitorService {

    private final TradeRepository tradeRepository;
    private final PriceCacheService priceCache;
    private final NotificationService notificationService;
    private final NotificationPublisher notificationPublisher;

    public TradeMonitorService(TradeRepository tradeRepository,
                                PriceCacheService priceCache,
                                NotificationService notificationService,
                                NotificationPublisher notificationPublisher) {
        this.tradeRepository = tradeRepository;
        this.priceCache = priceCache;
        this.notificationService = notificationService;
        this.notificationPublisher = notificationPublisher;
    }

    @Scheduled(fixedRateString = "${tradeos.poller.trademonitor:5000}")
    public void monitorTrades() {
        List<Trade> openTrades = tradeRepository.findByStatus("OPEN");
        if (openTrades.isEmpty()) return;

        for (Trade trade : openTrades) {
            try {
                Double currentPrice = priceCache.getPrice(trade.getSymbol());
                if (currentPrice == null) continue;

                boolean shouldClose = false;
                String touchType = null;

                if (trade.getTradeType().equalsIgnoreCase("BUY")) {
                    if (currentPrice >= trade.getTakeProfit()) {
                        shouldClose = true;
                        touchType = "TP";
                    } else if (currentPrice <= trade.getStopLoss()) {
                        shouldClose = true;
                        touchType = "SL";
                    } else if (currentPrice >= trade.getEntryPrice()
                            && trade.getStopLoss() < trade.getEntryPrice()) {
                        double halfWay = (trade.getEntryPrice() + trade.getTakeProfit()) / 2;
                        if (currentPrice >= halfWay) {
                            touchType = "breakeven";
                            trade.setStopLoss(trade.getEntryPrice());
                        }
                    }
                } else {
                    if (currentPrice <= trade.getTakeProfit()) {
                        shouldClose = true;
                        touchType = "TP";
                    } else if (currentPrice >= trade.getStopLoss()) {
                        shouldClose = true;
                        touchType = "SL";
                    } else if (currentPrice <= trade.getEntryPrice()
                            && trade.getStopLoss() > trade.getEntryPrice()) {
                        double halfWay = (trade.getEntryPrice() + trade.getTakeProfit()) / 2;
                        if (currentPrice <= halfWay) {
                            touchType = "breakeven";
                            trade.setStopLoss(trade.getEntryPrice());
                        }
                    }
                }

                if (touchType != null) {
                    String statusKey = touchType.equalsIgnoreCase("breakeven")
                            ? "be_touched" : touchType.toLowerCase() + "_touched";

                    trade.setStatus(statusKey);
                    tradeRepository.save(trade);

                    String aiMessage = notificationService.generateAiNotification(trade, touchType);
                    notificationPublisher.pushNotification(
                            touchType + " Alert",
                            aiMessage,
                            touchType.toLowerCase(),
                            trade.getSymbol()
                    );
                }

                if (shouldClose) {
                    trade.setExitPrice(currentPrice);

                    double pnl;
                    if (trade.getTradeType().equalsIgnoreCase("BUY")) {
                        pnl = (currentPrice - trade.getEntryPrice()) * trade.getPositionSize();
                    } else {
                        pnl = (trade.getEntryPrice() - currentPrice) * trade.getPositionSize();
                    }

                    trade.setPnl(pnl);
                    trade.setStatus("CLOSED");
                    tradeRepository.save(trade);
                }

            } catch (Exception e) {
                System.err.println("TradeMonitor error: " + e.getMessage());
            }
        }
    }
}
