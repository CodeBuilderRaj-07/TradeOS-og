package com.TradeOS.controller;

import com.TradeOS.analytics.PsychologyAiService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/psychology")
public class PsychologyAiController {

    @Autowired
    private PsychologyAiService psychologyAiService;

    @GetMapping("/analyze")
    public Map<String, String> analyzePsychology(
            HttpServletRequest request
    ) {

        String email =
                (String) request.getAttribute("email");

        return psychologyAiService
                .analyzePsychology(email);
    }
}