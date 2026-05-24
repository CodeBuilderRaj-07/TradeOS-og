package com.TradeOS.service;

import com.TradeOS.dto.CloseTradeRequest;
import com.TradeOS.dto.TradeRequest;
import com.TradeOS.dto.UpdateTradeRequest;
import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TradeService {

    @Autowired
    private TradeRepository tradeRepository;

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

        trade.setNotes(request.getNotes());

        tradeRepository.save(trade);

        return "Trade Updated Successfully";
    }

    public String closeTrade(
            Long tradeId,
            CloseTradeRequest request,
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

        trade.setExitPrice(request.getExitPrice());

        double pnl;

        if (trade.getTradeType().equals("BUY")) {

            pnl =
                    (trade.getExitPrice()
                            - trade.getEntryPrice())

                            * trade.getPositionSize();

        } else {

            pnl =
                    (trade.getEntryPrice()
                            - trade.getExitPrice())

                            * trade.getPositionSize();
        }

        trade.setPnl(pnl);

        trade.setStatus("CLOSED");

        tradeRepository.save(trade);

        return "Trade Closed Successfully";
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