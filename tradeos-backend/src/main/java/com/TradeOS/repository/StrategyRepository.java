package com.TradeOS.repository;

import com.TradeOS.entity.Strategy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StrategyRepository extends JpaRepository<Strategy, Long> {
    List<Strategy> findByUserEmail(String userEmail);
}
