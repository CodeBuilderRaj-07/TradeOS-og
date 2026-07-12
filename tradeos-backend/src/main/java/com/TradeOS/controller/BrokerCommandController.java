package com.TradeOS.controller;

import com.TradeOS.dto.ApiResponse;
import com.TradeOS.entity.BrokerCommand;
import com.TradeOS.service.BrokerCommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/broker/commands")
public class BrokerCommandController {

    @Autowired
    private BrokerCommandService brokerCommandService;

    @GetMapping("/pending")
    public ResponseEntity<List<BrokerCommand>> getPendingCommands(@RequestParam String accountId) {
        return ResponseEntity.ok(brokerCommandService.getPendingCommands(accountId));
    }

    @PostMapping("/{id}/ack")
    public ResponseEntity<ApiResponse<String>> acknowledge(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "DONE");
        String error = body.get("error");
        brokerCommandService.acknowledge(id, status, error);
        return ResponseEntity.ok(ApiResponse.ok("Command acknowledged"));
    }
}
