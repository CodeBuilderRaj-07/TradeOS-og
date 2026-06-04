package com.TradeOS.service;

import com.TradeOS.entity.TradingAccount;
import com.TradeOS.repository.TradingAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TradingAccountService {

    @Autowired
    private TradingAccountRepository repository;

    public List<TradingAccount> getUserAccounts(String email) {
        return repository.findByUserEmail(email);
    }

    public TradingAccount createAccount(TradingAccount account, String email) {
        account.setUserEmail(email);
        account.setCreatedAt(LocalDateTime.now());
        account.setActive(false);
        return repository.save(account);
    }

    public TradingAccount updateAccount(Long id, Map<String, Object> updates, String email) {
        TradingAccount acc = repository.findByIdAndUserEmail(id, email);
        if (acc == null) return null;

        if (updates.containsKey("name")) acc.setName((String) updates.get("name"));
        if (updates.containsKey("broker")) acc.setBroker((String) updates.get("broker"));
        if (updates.containsKey("type")) acc.setType((String) updates.get("type"));
        if (updates.containsKey("apiKey")) acc.setApiKey((String) updates.get("apiKey"));
        if (updates.containsKey("apiSecret")) acc.setApiSecret((String) updates.get("apiSecret"));
        if (updates.containsKey("currentBalance")) acc.setCurrentBalance(((Number) updates.get("currentBalance")).doubleValue());
        if (updates.containsKey("active")) acc.setActive((Boolean) updates.get("active"));

        if (Boolean.TRUE.equals(updates.get("active"))) {
            List<TradingAccount> all = repository.findByUserEmail(email);
            for (TradingAccount a : all) {
                if (!a.getId().equals(id)) {
                    a.setActive(false);
                    repository.save(a);
                }
            }
        }

        return repository.save(acc);
    }

    public boolean deleteAccount(Long id, String email) {
        TradingAccount acc = repository.findByIdAndUserEmail(id, email);
        if (acc == null) return false;
        repository.delete(acc);
        return true;
    }
}
