package com.TradeOS.controller;

import com.TradeOS.analytics.BacktestService;
import com.TradeOS.dto.BacktestRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/backtest")
public class BacktestController {

    @Autowired
    private BacktestService backtestService;

    @PostMapping
    public Map<String, Object> runBacktest(
            @RequestBody BacktestRequest request
    ) {

        return backtestService
                .runBacktest(request);
    }
}