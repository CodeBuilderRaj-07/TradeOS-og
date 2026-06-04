package com.TradeOS.repository;

import com.TradeOS.entity.AlgoExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlgoExecutionRepository extends JpaRepository<AlgoExecution, Long> {
    List<AlgoExecution> findByUserEmail(String userEmail);
    List<AlgoExecution> findByAlgoStrategyId(Long algoStrategyId);
    List<AlgoExecution> findByAlgoStrategyIdAndStatus(Long algoStrategyId, String status);
    List<AlgoExecution> findByUserEmailAndStatus(String userEmail, String status);
}
