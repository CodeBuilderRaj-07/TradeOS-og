package com.TradeOS.controller;

import com.TradeOS.dto.CloseTradeRequest;
import com.TradeOS.dto.TradeRequest;
import com.TradeOS.dto.UpdateTradeRequest;
import com.TradeOS.entity.Trade;
import com.TradeOS.service.TradeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private TradeService tradeService;

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

    @GetMapping
    public List<Trade> getUserTrades(
            HttpServletRequest httpRequest
    ) {

        String email =
                (String) httpRequest.getAttribute("email");

        return tradeService.getUserTrades(email);
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
            @RequestBody UpdateTradeRequest request,
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
            @RequestBody CloseTradeRequest request,
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