package com.TradeOS.repository;

import com.TradeOS.entity.BrokerCommand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BrokerCommandRepository extends JpaRepository<BrokerCommand, Long> {
    List<BrokerCommand> findByAccountIdAndStatusOrderByCreatedAtAsc(String accountId, String status);
}
