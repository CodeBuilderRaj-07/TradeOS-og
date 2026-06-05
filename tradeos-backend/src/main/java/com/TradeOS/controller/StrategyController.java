package com.TradeOS.controller;

import com.TradeOS.entity.Strategy;
import com.TradeOS.repository.StrategyRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/strategies")
public class StrategyController {

    @Autowired
    private StrategyRepository strategyRepository;

    @GetMapping
    public List<Strategy> getStrategies(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return strategyRepository.findByUserEmail(email);
    }

    @PostMapping
    public String createStrategy(@RequestBody Strategy strategy, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        strategy.setUserEmail(email);
        if (strategy.getType() == null) strategy.setType("manual");
        if (strategy.getStatus() == null) strategy.setStatus("ACTIVE");
        strategyRepository.save(strategy);
        return "Strategy created successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteStrategy(@PathVariable Long id, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        Strategy strategy = strategyRepository.findById(id).orElse(null);
        if (strategy == null) return "Strategy not found";
        if (!strategy.getUserEmail().equals(email)) {
            return "You do not have permission to delete this strategy";
        }
        strategyRepository.delete(strategy);
        return "Strategy deleted";
    }
}
