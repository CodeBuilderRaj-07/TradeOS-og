package com.TradeOS.service;

import com.TradeOS.repository.AlgoStrategyRepository;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PriceCacheService {

    private final AlgoStrategyRepository algoRepository;
    private final TradeRepository tradeRepository;
    private final LiveMarketService liveMarketService;

    private final ConcurrentHashMap<String, Double> priceCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> lastFetched = new ConcurrentHashMap<>();
    private Set<String> lastSymbols = Collections.emptySet();
    private long lastSymbolRefresh = 0;

    private final long symbolRefreshInterval;

    public PriceCacheService(AlgoStrategyRepository algoRepository,
                             TradeRepository tradeRepository,
                             LiveMarketService liveMarketService,
                             @Value("${tradeos.poller.symbol-refresh:10000}") long symbolRefreshInterval) {
        this.algoRepository = algoRepository;
        this.tradeRepository = tradeRepository;
        this.liveMarketService = liveMarketService;
        this.symbolRefreshInterval = symbolRefreshInterval;
    }

    public Double getPrice(String symbol) {
        return priceCache.get(symbol);
    }

    public Map<String, Double> getAllPrices() {
        return new HashMap<>(priceCache);
    }

    @Scheduled(fixedRateString = "${tradeos.poller.pricecache:5000}")
    public void refreshCache() {
        long now = System.currentTimeMillis();

        Set<String> symbols = lastSymbols;
        if (now - lastSymbolRefresh > symbolRefreshInterval) {
            symbols = resolveSymbols();
            lastSymbols = symbols;
            lastSymbolRefresh = now;
        }

        if (symbols.isEmpty()) return;

        for (String symbol : symbols) {
            Long last = lastFetched.get(symbol);
            if (last != null && now - last < 2000) continue;
            try {
                Double price = liveMarketService.getPriceForSymbol(symbol);
                if (price != null) {
                    priceCache.put(symbol, price);
                    lastFetched.put(symbol, now);
                }
            } catch (Exception ignored) {}
        }
    }

    private Set<String> resolveSymbols() {
        Set<String> symbols = new HashSet<>();
        try {
            algoRepository.findByActiveTrueAndStatus("RUNNING")
                    .forEach(a -> { if (a.getSymbol() != null) symbols.add(a.getSymbol()); });
        } catch (Exception ignored) {}
        try {
            tradeRepository.findByStatus("OPEN")
                    .forEach(t -> { if (t.getSymbol() != null) symbols.add(t.getSymbol()); });
        } catch (Exception ignored) {}
        if (symbols.isEmpty()) {
            symbols.addAll(Arrays.asList("BTCUSDT", "ETHUSDT", "XAUUSD"));
        }
        return symbols;
    }
}
