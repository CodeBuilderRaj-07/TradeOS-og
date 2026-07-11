package com.TradeOS.service;

import com.TradeOS.entity.AlgoExecution;
import com.TradeOS.entity.AlgoStrategy;
import com.TradeOS.entity.Trade;
import com.TradeOS.notification.NotificationPublisher;
import com.TradeOS.repository.AlgoExecutionRepository;
import com.TradeOS.repository.AlgoStrategyRepository;
import com.TradeOS.repository.TradeRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlgoEngineService {
    private static final Logger log = LoggerFactory.getLogger(AlgoEngineService.class);

    private final AlgoStrategyRepository algoRepository;
    private final AlgoExecutionRepository executionRepository;
    private final TradeRepository tradeRepository;
    private final PriceCacheService priceCache;
    private final NotificationPublisher notificationPublisher;

    public AlgoEngineService(AlgoStrategyRepository algoRepository,
                              AlgoExecutionRepository executionRepository,
                              TradeRepository tradeRepository,
                              PriceCacheService priceCache,
                              NotificationPublisher notificationPublisher) {
        this.algoRepository = algoRepository;
        this.executionRepository = executionRepository;
        this.tradeRepository = tradeRepository;
        this.priceCache = priceCache;
        this.notificationPublisher = notificationPublisher;
    }

    @Scheduled(fixedRateString = "${tradeos.poller.algoengine:5000}")
    public void executeAlgos() {
        List<AlgoStrategy> activeAlgos = algoRepository.findByActiveTrueAndStatus("RUNNING");
        if (activeAlgos.isEmpty()) return;

        for (AlgoStrategy algo : activeAlgos) {
            try {
                Double currentPrice = priceCache.getPrice(algo.getSymbol());
                if (currentPrice == null) continue;

                List<AlgoExecution> openExecs = executionRepository
                        .findByAlgoStrategyIdAndStatus(algo.getId(), "OPEN");

                if (openExecs.isEmpty()) {
                    tryEntry(algo, currentPrice);
                } else {
                    for (AlgoExecution exec : openExecs) {
                        monitorExecution(exec, algo, currentPrice);
                    }
                }
            } catch (Exception e) {
                log.error("AlgoEngine error for strategy {}: {}", algo.getId(), e.getMessage());
            }
        }
    }

    private void tryEntry(AlgoStrategy algo, double currentPrice) {
        boolean shouldEnter = false;
        String triggerReason = "";

        switch (algo.getEntryTrigger()) {
            case "IMMEDIATE":
                shouldEnter = true;
                triggerReason = "Immediate entry triggered";
                break;
            case "PRICE_ABOVE":
                if (currentPrice >= algo.getEntryValue()) {
                    shouldEnter = true;
                    triggerReason = "Price above " + algo.getEntryValue();
                }
                break;
            case "PRICE_BELOW":
                if (currentPrice <= algo.getEntryValue()) {
                    shouldEnter = true;
                    triggerReason = "Price below " + algo.getEntryValue();
                }
                break;
        }

        if (!shouldEnter) return;

        Trade trade = new Trade();
        trade.setSymbol(algo.getSymbol());
        trade.setTradeType(algo.getTradeDirection());
        trade.setEntryPrice(currentPrice);
        trade.setStopLoss(algo.getStopLoss());
        trade.setTakeProfit(algo.getTakeProfit());
        trade.setPositionSize(algo.getPositionSize());
        trade.setPnl(0);
        trade.setStatus("OPEN");
        trade.setNotes("[ALGO] " + algo.getName() + " - " + triggerReason);
        trade.setUserEmail(algo.getUserEmail());
        trade.setCreatedAt(LocalDateTime.now());
        trade = tradeRepository.save(trade);

        AlgoExecution exec = new AlgoExecution();
        exec.setAlgoStrategyId(algo.getId());
        exec.setTradeId(trade.getId());
        exec.setSymbol(algo.getSymbol());
        exec.setTradeDirection(algo.getTradeDirection());
        exec.setEntryPrice(currentPrice);
        exec.setPositionSize(algo.getPositionSize());
        exec.setStatus("OPEN");
        exec.setTriggerReason(triggerReason);
        exec.setUserEmail(algo.getUserEmail());
        exec.setStartedAt(LocalDateTime.now());
        executionRepository.save(exec);

        notificationPublisher.pushNotification(
                "Algo Entry",
                algo.getName() + " entered " + algo.getTradeDirection() + " " + algo.getSymbol() + " @ " + currentPrice,
                "algo_entry",
                algo.getSymbol()
        );
    }

    private void monitorExecution(AlgoExecution exec, AlgoStrategy algo, double currentPrice) {
        boolean shouldClose = false;
        String closeReason = null;

        if ("BUY".equalsIgnoreCase(algo.getTradeDirection())) {
            if (currentPrice >= algo.getTakeProfit()) {
                shouldClose = true;
                closeReason = "TP";
            } else if (currentPrice <= algo.getStopLoss()) {
                shouldClose = true;
                closeReason = "SL";
            }
        } else {
            if (currentPrice <= algo.getTakeProfit()) {
                shouldClose = true;
                closeReason = "TP";
            } else if (currentPrice >= algo.getStopLoss()) {
                shouldClose = true;
                closeReason = "SL";
            }
        }

        if (!shouldClose) return;

        Trade trade = tradeRepository.findByIdAndUserEmail(exec.getTradeId(), algo.getUserEmail());
        if (trade == null) return;

        trade.setExitPrice(currentPrice);

        double pnl;
        if ("BUY".equalsIgnoreCase(algo.getTradeDirection())) {
            pnl = (currentPrice - exec.getEntryPrice()) * exec.getPositionSize();
        } else {
            pnl = (exec.getEntryPrice() - currentPrice) * exec.getPositionSize();
        }

        trade.setPnl(pnl);
        trade.setStatus("CLOSED");
        tradeRepository.save(trade);

        exec.setExitPrice(currentPrice);
        exec.setPnl(pnl);
        exec.setStatus("CLOSED");
        exec.setClosedAt(LocalDateTime.now());
        executionRepository.save(exec);

        String statusKey = closeReason.equalsIgnoreCase("TP") ? "tp_hit" : "sl_hit";
        notificationPublisher.pushNotification(
                "Algo " + closeReason,
                algo.getName() + " closed " + algo.getSymbol() + " - " + closeReason + " @ " + currentPrice + " | PnL: " + String.format("%.2f", pnl),
                statusKey,
                algo.getSymbol()
        );
    }
}
