package com.TradeOS.controller;

import com.TradeOS.entity.AlgoExecution;
import com.TradeOS.entity.AlgoStrategy;
import com.TradeOS.service.AlgoStrategyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/algo-strategies")
public class AlgoStrategyController {

    @Autowired
    private AlgoStrategyService service;

    @GetMapping
    public List<AlgoStrategy> getStrategies(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return service.getUserStrategies(email);
    }

    @PostMapping
    public ResponseEntity<?> createStrategy(@RequestBody AlgoStrategy strategy, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        AlgoStrategy saved = service.createStrategy(strategy, email);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStrategy(@PathVariable Long id, @RequestBody AlgoStrategy updates, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        AlgoStrategy updated = service.updateStrategy(id, updates, email);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleStrategy(@PathVariable Long id, @RequestBody Map<String, Boolean> body, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        boolean active = body.getOrDefault("active", false);
        AlgoStrategy updated = service.toggleActive(id, active, email);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStrategy(@PathVariable Long id, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        boolean deleted = service.deleteStrategy(id, email);
        if (!deleted) return ResponseEntity.notFound().build();
        return ResponseEntity.ok("Strategy deleted");
    }

    @GetMapping("/{id}/executions")
    public List<AlgoExecution> getExecutions(@PathVariable Long id, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return service.getExecutions(id, email);
    }
}
