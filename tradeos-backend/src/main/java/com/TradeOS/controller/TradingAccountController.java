package com.TradeOS.controller;

import com.TradeOS.entity.TradingAccount;
import com.TradeOS.service.TradingAccountService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trading-accounts")
public class TradingAccountController {

    @Autowired
    private TradingAccountService service;

    @GetMapping
    public List<TradingAccount> getAccounts(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return service.getUserAccounts(email);
    }

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody TradingAccount account, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        TradingAccount saved = service.createAccount(account, email);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Map<String, Object> updates, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        TradingAccount updated = service.updateAccount(id, updates, email);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        boolean deleted = service.deleteAccount(id, email);
        if (!deleted) return ResponseEntity.notFound().build();
        return ResponseEntity.ok("Account deleted");
    }
}
