package com.TradeOS.service;

import com.TradeOS.entity.AlgoExecution;
import com.TradeOS.entity.AlgoStrategy;
import com.TradeOS.entity.Trade;
import com.TradeOS.repository.AlgoExecutionRepository;
import com.TradeOS.repository.AlgoStrategyRepository;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlgoStrategyService {

    @Autowired
    private AlgoStrategyRepository algoRepository;

    @Autowired
    private AlgoExecutionRepository executionRepository;

    @Autowired
    private TradeRepository tradeRepository;

    public List<AlgoStrategy> getUserStrategies(String email) {
        return algoRepository.findByUserEmail(email);
    }

    public AlgoStrategy createStrategy(AlgoStrategy strategy, String email) {
        strategy.setUserEmail(email);
        strategy.setCreatedAt(LocalDateTime.now());
        strategy.setActive(false);
        strategy.setStatus("STOPPED");
        return algoRepository.save(strategy);
    }

    public AlgoStrategy updateStrategy(Long id, AlgoStrategy updates, String email) {
        AlgoStrategy existing = algoRepository.findByIdAndUserEmail(id, email);
        if (existing == null) return null;

        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getSymbol() != null) existing.setSymbol(updates.getSymbol());
        if (updates.getTradeDirection() != null) existing.setTradeDirection(updates.getTradeDirection());
        if (updates.getEntryTrigger() != null) existing.setEntryTrigger(updates.getEntryTrigger());
        if (updates.getEntryValue() > 0) existing.setEntryValue(updates.getEntryValue());
        if (updates.getStopLoss() > 0) existing.setStopLoss(updates.getStopLoss());
        if (updates.getTakeProfit() > 0) existing.setTakeProfit(updates.getTakeProfit());
        if (updates.getPositionSize() > 0) existing.setPositionSize(updates.getPositionSize());
        if (updates.getMaxActiveTrades() > 0) existing.setMaxActiveTrades(updates.getMaxActiveTrades());
        if (updates.getTradingAccountId() != null) existing.setTradingAccountId(updates.getTradingAccountId());

        return algoRepository.save(existing);
    }

    public AlgoStrategy toggleActive(Long id, boolean active, String email) {
        AlgoStrategy existing = algoRepository.findByIdAndUserEmail(id, email);
        if (existing == null) return null;
        existing.setActive(active);
        existing.setStatus(active ? "RUNNING" : "STOPPED");
        return algoRepository.save(existing);
    }

    public boolean deleteStrategy(Long id, String email) {
        AlgoStrategy existing = algoRepository.findByIdAndUserEmail(id, email);
        if (existing == null) return false;
        existing.setActive(false);
        existing.setStatus("STOPPED");
        algoRepository.save(existing);

        List<AlgoExecution> activeExecs = executionRepository.findByAlgoStrategyIdAndStatus(id, "OPEN");
        for (AlgoExecution exec : activeExecs) {
            exec.setStatus("CLOSED");
            exec.setClosedAt(LocalDateTime.now());
            executionRepository.save(exec);
        }

        algoRepository.delete(existing);
        return true;
    }

    public List<AlgoExecution> getExecutions(Long strategyId, String email) {
        AlgoStrategy strategy = algoRepository.findByIdAndUserEmail(strategyId, email);
        if (strategy == null) return List.of();
        return executionRepository.findByAlgoStrategyId(strategyId);
    }
}
