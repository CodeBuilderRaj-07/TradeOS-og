package com.TradeOS.controller;

import com.TradeOS.dto.ApiResponse;
import com.TradeOS.dto.MT5TradeUpdateDTO;
import com.TradeOS.service.BrokerSyncService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mt5")
public class MT5Controller {

    private static final Logger log = LoggerFactory.getLogger(MT5Controller.class);

    @Autowired
    private BrokerSyncService brokerSyncService;

    @PostMapping("/trade-update")
    public ResponseEntity<ApiResponse<String>> receiveTradeUpdate(@RequestBody MT5TradeUpdateDTO dto) {
        log.info("Received MT5 trade update: ticket={} status={}", dto.getTicket(), dto.getStatus());
        dto.setBroker("MT5");
        brokerSyncService.processTradeUpdate(dto);
        return ResponseEntity.ok(ApiResponse.ok("Trade update processed"));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("MT5 endpoint is healthy"));
    }
}
