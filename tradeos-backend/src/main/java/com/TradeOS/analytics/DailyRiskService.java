package com.TradeOS.analytics;

import com.TradeOS.entity.Trade;
import com.TradeOS.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DailyRiskService {

    @Autowired
    private TradeRepository tradeRepository;

    public Map<String, Object> checkDailyRisk(
            String email
    ) {

        List<Trade> trades =
                tradeRepository.findByUserEmail(email);

        double dailyLoss = 0;

        LocalDate today =
                LocalDate.now();

        for (Trade trade : trades) {

            if (trade.getCreatedAt() != null
                    &&
                    trade.getCreatedAt()
                            .toLocalDate()
                            .equals(today)) {

                if (trade.getPnl() < 0) {

                    dailyLoss +=
                            Math.abs(
                                    trade.getPnl()
                            );
                }
            }
        }

        boolean limitExceeded =
                dailyLoss >= 500;

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "dailyLoss",
                dailyLoss
        );

        result.put(
                "limitExceeded",
                limitExceeded
        );

        if (limitExceeded) {

            result.put(
                    "warning",
                    "Daily loss limit exceeded. Stop trading for today."
            );

        } else {

            result.put(
                    "warning",
                    "Risk level is safe."
            );
        }

        return result;
    }
}