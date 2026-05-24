package com.TradeOS.controller;

import com.TradeOS.entity.Journal;
import com.TradeOS.service.JournalService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @PostMapping
    public Journal createJournal(
            @RequestBody Journal journal,
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return journalService.createJournal(
                journal,
                email
        );
    }

    @GetMapping
    public List<Journal> getUserJournals(
            HttpServletRequest request
    ) {

        String email =
                (String)
                        request.getAttribute("email");

        return journalService.getUserJournals(
                email
        );
    }
}