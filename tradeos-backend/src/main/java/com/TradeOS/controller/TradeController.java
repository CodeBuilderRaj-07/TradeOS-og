package com.TradeOS.controller;

import com.TradeOS.dto.ApiResponse;
import com.TradeOS.dto.CloseTradeRequest;
import com.TradeOS.dto.TradeRequest;
import com.TradeOS.dto.UpdateTradeRequest;
import com.TradeOS.entity.Trade;
import com.TradeOS.service.TradeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @PostMapping
    public String addTrade(
           @jakarta.validation.Valid
           @RequestBody TradeRequest request,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.addTrade(request, email);
    }

    @PostMapping("/create")
    public String createTrade(
           @jakarta.validation.Valid
           @RequestBody TradeRequest request,
            HttpServletRequest httpRequest
    ) {
        String email = (String) httpRequest.getAttribute("email");
        return tradeService.addTrade(request, email);
    }

    @PostMapping("/import")
    public ResponseEntity<?> importTrades(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest httpRequest
    ) {
        String email = (String) httpRequest.getAttribute("email");
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            String headerLine = reader.readLine();
            int imported = 0;
            int skipped = 0;
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) { skipped++; continue; }
                try {
                    String[] parts = line.split(",");
                    if (parts.length < 4) { skipped++; continue; }
                    TradeRequest req = new TradeRequest();
                    req.setSymbol(parts[0].trim());
                    req.setTradeType(parts[1].trim().equalsIgnoreCase("SELL") ? "SELL" : "BUY");
                    req.setEntryPrice(Double.parseDouble(parts[2].trim()));
                    req.setStopLoss(parts.length > 3 ? Double.parseDouble(parts[3].trim()) : 0);
                    req.setTakeProfit(parts.length > 4 ? Double.parseDouble(parts[4].trim()) : 0);
                    req.setPositionSize(parts.length > 5 ? Double.parseDouble(parts[5].trim()) : 0.01);
                    req.setPnl(parts.length > 6 ? Double.parseDouble(parts[6].trim()) : 0);
                    tradeService.addTrade(req, email);
                    imported++;
                } catch (Exception e) {
                    skipped++;
                }
            }
            reader.close();
            return ResponseEntity.ok(Map.of(
                "imported", imported,
                "skipped", skipped,
                "message", "Imported " + imported + " trades" + (skipped > 0 ? ", skipped " + skipped : "")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to parse CSV: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Trade> getUserTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getUserTrades(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTradeById(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        try {
            String email = (String) httpRequest.getAttribute("email");
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("User not authenticated"));
            }
            Trade trade = tradeService.getTradeById(id, email);
            if (trade == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Trade not found"));
            }
            return ResponseEntity.ok(trade);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error loading trade: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public List<Trade> searchTrades(
            @RequestParam String keyword,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.searchTrades(
                email,
                keyword
        );
    }

    @GetMapping("/oldest")
    public List<Trade> getOldestTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getOldestTrades(email);
    }

    @GetMapping("/highest-pnl")
    public List<Trade> getHighestPnlTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getHighestPnlTrades(email);
    }

    @GetMapping("/paged")
    public Page<Trade> getPaginatedTrades(
            @RequestParam int page,
            @RequestParam int size,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getPaginatedTrades(
                email,
                page,
                size
        );
    }

    @GetMapping("/open")
    public List<Trade> getOpenTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getTradesByStatus(
                email,
                "OPEN"
        );
    }

    @GetMapping("/closed")
    public List<Trade> getClosedTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getTradesByStatus(
                email,
                "CLOSED"
        );
    }

    @GetMapping("/symbol/{symbol}")
    public List<Trade> getTradesBySymbol(
            @PathVariable String symbol,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getTradesBySymbol(
                email,
                symbol
        );
    }

    @GetMapping("/latest")
    public List<Trade> getLatestTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getLatestTrades(email);
    }

    @GetMapping("/export")
    public String exportTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.exportTradesToCsv(
                email
        );
    }

    @PutMapping("/{id}")
    public String updateTrade(
            @PathVariable Long id,
            @RequestBody @jakarta.validation.Valid UpdateTradeRequest request,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.updateTrade(
                id,
                request,
                email
        );
    }

    @PutMapping("/{id}/close")
    public String closeTrade(
            @PathVariable Long id,
            @RequestBody @jakarta.validation.Valid CloseTradeRequest request,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.closeTrade(
                id,
                request,
                email
        );
    }

    @PutMapping("/{id}/move-to-be")
    public String moveToBreakeven(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        String email = (String) httpRequest.getAttribute("email");
        return tradeService.moveToBreakeven(id, email);
    }

    @PutMapping("/{id}/partial-close")
    public String partialClose(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body,
            HttpServletRequest httpRequest
    ) {
        String email = (String) httpRequest.getAttribute("email");
        double percentage = body.getOrDefault("percentage", 50.0);
        return tradeService.partialClose(id, percentage, email);
    }

    @PutMapping("/{id}/sl-tp")
    public String updateSlTp(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest httpRequest
    ) {
        String email = (String) httpRequest.getAttribute("email");
        Double stopLoss = body.get("stopLoss") != null ? ((Number) body.get("stopLoss")).doubleValue() : null;
        Double takeProfit = body.get("takeProfit") != null ? ((Number) body.get("takeProfit")).doubleValue() : null;
        return tradeService.updateSlTp(id, stopLoss, takeProfit, email);
    }

    @DeleteMapping("/{id}")
    public String deleteTrade(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.deleteTrade(
                id,
                email
        );
    }
}