package com.TradeOS.repository;

import com.TradeOS.entity.TradingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradingAccountRepository extends JpaRepository<TradingAccount, Long> {
    List<TradingAccount> findByUserEmail(String userEmail);
    TradingAccount findByIdAndUserEmail(Long id, String userEmail);
    TradingAccount findByBrokerAndApiKey(String broker, String apiKey);
}
