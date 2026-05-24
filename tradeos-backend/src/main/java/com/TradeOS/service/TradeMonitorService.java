package com.TradeOS.service;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TradeMonitorService {

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private LiveMarketService liveMarketService;

    @Scheduled(fixedRate = 30000)
    public void monitorTrades() {

        List<Trade> openTrades =
                tradeRepository.findByStatus("OPEN");

        if (openTrades.isEmpty()) {
            return;
        }

        Map<String, Object> prices =
                liveMarketService.getMarketPrices();

        for (Trade trade : openTrades) {

            try {

                Object marketPriceObject =
                        prices.get(
                                trade.getSymbol()
                        );

                if (marketPriceObject == null) {
                    continue;
                }

                double currentPrice =
                        Double.parseDouble(
                                marketPriceObject.toString()
                        );

                boolean shouldClose = false;

                if (
                        trade.getTradeType()
                                .equalsIgnoreCase("BUY")
                ) {

                    if (
                            currentPrice >= trade.getTakeProfit()
                    ) {

                        shouldClose = true;
                    }

                    if (
                            currentPrice <= trade.getStopLoss()
                    ) {

                        shouldClose = true;
                    }

                } else {

                    if (
                            currentPrice <= trade.getTakeProfit()
                    ) {

                        shouldClose = true;
                    }

                    if (
                            currentPrice >= trade.getStopLoss()
                    ) {

                        shouldClose = true;
                    }
                }

                if (shouldClose) {

                    trade.setExitPrice(currentPrice);

                    double pnl;

                    if (
                            trade.getTradeType()
                                    .equalsIgnoreCase("BUY")
                    ) {

                        pnl =
                                (currentPrice
                                        - trade.getEntryPrice())

                                        * trade.getPositionSize();

                    } else {

                        pnl =
                                (trade.getEntryPrice()
                                        - currentPrice)

                                        * trade.getPositionSize();
                    }

                    trade.setPnl(pnl);

                    trade.setStatus("CLOSED");

                    tradeRepository.save(trade);

                    System.out.println(
                            "Trade Auto Closed: "
                                    + trade.getSymbol()
                    );
                }

            } catch (Exception e) {

                System.out.println(
                        e.getMessage()
                );
            }
        }
    }
}