package com.TradeOS.service;

import com.TradeOS.dto.CloseTradeRequest;
import com.TradeOS.dto.TradeRequest;
import com.TradeOS.dto.UpdateTradeRequest;
import com.TradeOS.entity.BrokerCommand;
import com.TradeOS.entity.Trade;
import com.TradeOS.entity.TradingAccount;
import com.TradeOS.repository.BrokerCommandRepository;
import com.TradeOS.repository.TradeRepository;
import com.TradeOS.repository.TradingAccountRepository;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TradeService {

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private TradingAccountRepository tradingAccountRepository;

    @Autowired
    private BrokerCommandService brokerCommandService;

    public List<Trade> getUserTrades(String email) {

        return tradeRepository.findByUserEmail(email);

    }

    public List<Trade> searchTrades(
            String email,
            String keyword
    ) {

        return tradeRepository
                .findByUserEmailAndSymbolContainingIgnoreCase(
                        email,
                        keyword
                );
    }

    public List<Trade> getOldestTrades(
            String email
    ) {

        return tradeRepository
                .findByUserEmailOrderByIdAsc(email);
    }

    public List<Trade> getHighestPnlTrades(
            String email
    ) {

        return tradeRepository
                .findByUserEmailOrderByPnlDesc(email);
    }

    public Page<Trade> getPaginatedTrades(
            String email,
            int page,
            int size
    ) {

        return tradeRepository.findByUserEmailOrderByIdDesc(
                email,
                PageRequest.of(page, size)
        );
    }

    public List<Trade> getTradesByStatus(
            String email,
            String status
    ) {

        return tradeRepository.findByUserEmailAndStatus(
                email,
                status
        );
    }

    public List<Trade> getTradesBySymbol(
            String email,
            String symbol
    ) {

        return tradeRepository.findByUserEmailAndSymbol(
                email,
                symbol
        );
    }

    public List<Trade> getLatestTrades(String email) {

        return tradeRepository
                .findTop5ByUserEmailOrderByIdDesc(email);

    }

    public Trade getTradeById(Long tradeId, String email) {
        return tradeRepository.findByIdAndUserEmail(tradeId, email);
    }

    public String addTrade(
            TradeRequest request,
            String email
    ) {

        Trade trade = new Trade();

        trade.setSymbol(request.getSymbol());
        trade.setTradeType(request.getTradeType());
        trade.setEntryPrice(request.getEntryPrice());

        trade.setExitPrice(0);

        trade.setStopLoss(request.getStopLoss());
        trade.setTakeProfit(request.getTakeProfit());

        trade.setPositionSize(request.getPositionSize());

        trade.setPnl(0);

        trade.setStatus("OPEN");

        trade.setNotes(request.getNotes());

        trade.setRiskPct(request.getRiskPct());
        trade.setSession(request.getSession());
        trade.setStrategy(request.getStrategy());
        trade.setTimeframe(request.getTimeframe());
        trade.setConfidence(request.getConfidence());
        trade.setTags(request.getTags());

        trade.setUserEmail(email);

        trade.setCreatedAt(LocalDateTime.now());

        tradeRepository.save(trade);

        return "Trade Added Successfully";
    }

    public String updateTrade(
            Long tradeId,
            UpdateTradeRequest request,
            String email
    ) {

        Trade trade =
                tradeRepository.findByIdAndUserEmail(
                        tradeId,
                        email
                );

        if (trade == null) {
            return "Trade Not Found";
        }

        trade.setSymbol(request.getSymbol());
        trade.setEntryPrice(request.getEntryPrice());
        trade.setStopLoss(request.getStopLoss());
        trade.setTakeProfit(request.getTakeProfit());
        trade.setPositionSize(request.getPositionSize());
        trade.setNotes(request.getNotes());
        trade.setStrategy(request.getStrategy());
        trade.setSession(request.getSession());
        trade.setTimeframe(request.getTimeframe());
        trade.setConfidence(request.getConfidence());
        trade.setRiskPct(request.getRiskPct());
        trade.setTags(request.getTags());

        tradeRepository.save(trade);

        return "Trade Updated Successfully";
    }

    public String closeTrade(
            Long tradeId,
            CloseTradeRequest request,
            String email
    ) {
        Trade trade = tradeRepository.findByIdAndUserEmail(tradeId, email);
        if (trade == null) return "Trade Not Found";

        // Route MT5/MT4 trades through broker command queue
        if (trade.getMt5Ticket() != null && trade.getMt5AccountId() != null) {
            TradingAccount brokerAcc = tradingAccountRepository.findByBrokerAndApiKey(
                trade.getMt5AccountId().matches("\\d+") ? findBrokerForTrade(trade) : trade.getMt5AccountId(),
                trade.getMt5AccountId()
            );
            String broker = brokerAcc != null ? brokerAcc.getBroker() : "MT5";
            brokerCommandService.createCloseCommand(trade, broker, trade.getMt5AccountId());
            trade.setStatus("CLOSING");
            trade.setExitPrice(request.getExitPrice() != null ? request.getExitPrice() : 0);
            tradeRepository.save(trade);
            return "Close queued to broker";
        }

        if (request.getExitPrice() == null) return "Exit price is required";

        trade.setExitPrice(request.getExitPrice());
        double pnl;
        if (trade.getTradeType().equals("BUY")) {
            pnl = (trade.getExitPrice() - trade.getEntryPrice()) * trade.getPositionSize();
        } else {
            pnl = (trade.getEntryPrice() - trade.getExitPrice()) * trade.getPositionSize();
        }
        trade.setPnl(pnl);
        trade.setStatus("CLOSED");
        tradeRepository.save(trade);
        return "Trade Closed Successfully";
    }

    private String findBrokerForTrade(Trade trade) {
        List<TradingAccount> accounts = tradingAccountRepository.findByUserEmail(trade.getUserEmail());
        for (TradingAccount acc : accounts) {
            if (acc.getApiKey() != null && acc.getApiKey().equals(trade.getMt5AccountId())) {
                return acc.getBroker();
            }
        }
        return "MT5";
    }

    public String moveToBreakeven(
            Long tradeId,
            String email
    ) {
        Trade trade = tradeRepository.findByIdAndUserEmail(tradeId, email);
        if (trade == null) return "Trade Not Found";
        if (!"OPEN".equals(trade.getStatus())) return "Trade is not open";

        if (trade.getMt5Ticket() != null && trade.getMt5AccountId() != null) {
            brokerCommandService.createMoveToBeCommand(trade, findBrokerForTrade(trade), trade.getMt5AccountId());
            trade.setStatus("be_queued");
            tradeRepository.save(trade);
            return "Breakeven queued to broker";
        }

        trade.setStopLoss(trade.getEntryPrice());
        trade.setStatus("be_touched");
        tradeRepository.save(trade);
        return "Stop Loss moved to Breakeven";
    }

    public String partialClose(
            Long tradeId,
            double percentage,
            String email
    ) {
        Trade trade = tradeRepository.findByIdAndUserEmail(tradeId, email);
        if (trade == null) return "Trade Not Found";
        if (!"OPEN".equals(trade.getStatus())) return "Trade is not open";

        if (trade.getMt5Ticket() != null && trade.getMt5AccountId() != null) {
            String broker = findBrokerForTrade(trade);
            brokerCommandService.createPartialCloseCommand(trade, percentage, broker, trade.getMt5AccountId());
            trade.setStatus("closing_partial");
            tradeRepository.save(trade);
            return String.format("Partial close of %.0f%% queued to broker", percentage);
        }

        double originalSize = trade.getPositionSize();
        double closeSize = originalSize * (percentage / 100.0);
        double remainingSize = originalSize - closeSize;

        if (remainingSize <= 0) {
            return "Percentage too high. Use close instead.";
        }

        trade.setPositionSize(remainingSize);
        tradeRepository.save(trade);
        return String.format("Closed %.0f%% of position. Remaining: %s lots", percentage, remainingSize);
    }

    public String trailStop(
            Long tradeId,
            double offset,
            String email
    ) {
        Trade trade = tradeRepository.findByIdAndUserEmail(tradeId, email);
        if (trade == null) return "Trade Not Found";
        if (!"OPEN".equals(trade.getStatus())) return "Trade is not open";

        if (trade.getMt5Ticket() != null && trade.getMt5AccountId() != null) {
            brokerCommandService.createTrailStopCommand(trade, offset, findBrokerForTrade(trade), trade.getMt5AccountId());
            trade.setStatus("trail_queued");
            tradeRepository.save(trade);
            return "Trail stop queued to broker";
        }

        return "Trail stop requires an MT5/MT4 connected trade";
    }

    public List<String> closeAll(String email) {
        List<Trade> openTrades = tradeRepository.findByUserEmailAndStatus(email, "OPEN");
        List<String> results = new ArrayList<>();
        for (Trade trade : openTrades) {
            if (trade.getMt5Ticket() != null && trade.getMt5AccountId() != null) {
                String broker = findBrokerForTrade(trade);
                brokerCommandService.createCloseCommand(trade, broker, trade.getMt5AccountId());
                trade.setStatus("CLOSING");
                tradeRepository.save(trade);
                results.add("Close queued for " + trade.getSymbol() + " (ticket=" + trade.getMt5Ticket() + ")");
            } else {
                results.add("Skipped " + trade.getSymbol() + " — no broker connection");
            }
        }
        return results;
    }

    public String updateSlTp(
            Long tradeId,
            Double stopLoss,
            Double takeProfit,
            String email
    ) {
        Trade trade = tradeRepository.findByIdAndUserEmail(tradeId, email);
        if (trade == null) return "Trade Not Found";

        if (trade.getMt5Ticket() != null && trade.getMt5AccountId() != null) {
            brokerCommandService.createSlTpCommand(trade, stopLoss, takeProfit, findBrokerForTrade(trade), trade.getMt5AccountId());
            if (stopLoss != null) trade.setStopLoss(stopLoss);
            if (takeProfit != null) trade.setTakeProfit(takeProfit);
            tradeRepository.save(trade);
            return "SL/TP update queued to broker";
        }

        if (stopLoss != null) trade.setStopLoss(stopLoss);
        if (takeProfit != null) trade.setTakeProfit(takeProfit);
        tradeRepository.save(trade);
        return "SL/TP updated successfully";
    }

    public String deleteTrade(
            Long tradeId,
            String email
    ) {

        Trade trade =
                tradeRepository.findByIdAndUserEmail(
                        tradeId,
                        email
                );

        if (trade == null) {
            return "Trade Not Found";
        }

        tradeRepository.delete(trade);

        return "Trade Deleted Successfully";
    }

    public String exportTradesToCsv(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        StringWriter stringWriter =
                new StringWriter();

        CSVWriter writer =
                new CSVWriter(stringWriter);

        String[] header = {
                "ID",
                "SYMBOL",
                "TYPE",
                "ENTRY",
                "EXIT",
                "PNL",
                "STATUS"
        };

        writer.writeNext(header);

        for (Trade trade : trades) {

            String[] row = {

                    String.valueOf(trade.getId()),

                    trade.getSymbol(),

                    trade.getTradeType(),

                    String.valueOf(
                            trade.getEntryPrice()
                    ),

                    String.valueOf(
                            trade.getExitPrice()
                    ),

                    String.valueOf(
                            trade.getPnl()
                    ),

                    trade.getStatus()
            };

            writer.writeNext(row);
        }

        return stringWriter.toString();
    }
}