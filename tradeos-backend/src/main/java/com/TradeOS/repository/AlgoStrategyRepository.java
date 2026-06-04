package com.TradeOS.repository;

import com.TradeOS.entity.AlgoStrategy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlgoStrategyRepository extends JpaRepository<AlgoStrategy, Long> {
    List<AlgoStrategy> findByUserEmail(String userEmail);
    List<AlgoStrategy> findByUserEmailAndStatus(String userEmail, String status);
    List<AlgoStrategy> findByActiveTrueAndStatus(String status);
    AlgoStrategy findByIdAndUserEmail(Long id, String userEmail);
}
