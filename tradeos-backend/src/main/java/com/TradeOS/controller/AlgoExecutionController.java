package com.TradeOS.controller;

import com.TradeOS.entity.AlgoExecution;
import com.TradeOS.repository.AlgoExecutionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/algo-executions")
public class AlgoExecutionController {

    @Autowired
    private AlgoExecutionRepository repository;

    @GetMapping
    public List<AlgoExecution> getExecutions(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return repository.findByUserEmail(email);
    }

    @GetMapping("/open")
    public List<AlgoExecution> getOpenExecutions(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return repository.findByUserEmailAndStatus(email, "OPEN");
    }
}
