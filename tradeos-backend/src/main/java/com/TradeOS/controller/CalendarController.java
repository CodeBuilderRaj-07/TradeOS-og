package com.TradeOS.controller;

import com.TradeOS.repository.TradeRepository;
import com.TradeOS.entity.Trade;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private TradeRepository tradeRepository;

    @GetMapping
    public List<Map<String, Object>> getCalendarData(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        List<Trade> trades =
                tradeRepository.findByUserEmail(
                        email
                );

        Map<LocalDate, Double> pnlMap =
                new HashMap<>();

        for (Trade trade : trades) {

            if (
                    trade.getCreatedAt()
                            != null
            ) {

                LocalDate date =
                        trade.getCreatedAt()
                                .toLocalDate();

                double currentPnl =
                        pnlMap.getOrDefault(
                                date,
                                0.0
                        );

                pnlMap.put(
                        date,
                        currentPnl +
                                trade.getPnl()
                );
            }
        }

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (
                Map.Entry<
                        LocalDate,
                        Double
                        > entry
                : pnlMap.entrySet()
        ) {

            Map<String, Object> data =
                    new HashMap<>();

            data.put(
                    "date",
                    entry.getKey()
                            .toString()
            );

            data.put(
                    "pnl",
                    entry.getValue()
            );

            result.add(data);
        }

        return result;
    }
}