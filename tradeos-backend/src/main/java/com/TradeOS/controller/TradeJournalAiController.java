package com.TradeOS.controller;

import com.TradeOS.analytics.TradeJournalAiService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/journal-ai")
public class TradeJournalAiController {

    @Autowired
    private TradeJournalAiService tradeJournalAiService;

    @GetMapping("/analyze")
    public Map<String, String> analyzeJournal(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("email");

        return tradeJournalAiService
                .analyzeJournal(email);
    }
}