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
@RequestMapping("/api/broker")
public class BrokerController {

    private static final Logger log = LoggerFactory.getLogger(BrokerController.class);

    @Autowired
    private BrokerSyncService brokerSyncService;

    @PostMapping("/trade-update")
    public ResponseEntity<ApiResponse<String>> receiveTradeUpdate(
            @RequestBody MT5TradeUpdateDTO dto,
            @RequestHeader(value = "X-API-Token", required = false) String headerToken,
            @RequestParam(value = "token", required = false) String queryToken
    ) {
        String apiToken = headerToken != null ? headerToken : queryToken;
        log.info("Received broker trade update: ticket={} status={} broker={}", dto.getTicket(), dto.getStatus(), dto.getBroker());
        brokerSyncService.processTradeUpdate(dto, apiToken);
        return ResponseEntity.ok(ApiResponse.ok("Trade update processed"));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("Broker sync endpoint is healthy"));
    }
}
