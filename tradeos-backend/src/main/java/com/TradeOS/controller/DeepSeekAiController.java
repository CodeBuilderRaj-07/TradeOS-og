package com.TradeOS.controller;

import com.TradeOS.analytics.DeepSeekAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/deepseek")
public class DeepSeekAiController {

    @Autowired
    private DeepSeekAiService deepSeekAiService;

    @PostMapping("/ask")
    public Map<String, String> askAi(
            @RequestBody Map<String, String> body
    ) {

        String prompt =
                body.get("prompt");

        return deepSeekAiService
                .askAi(prompt);
    }
}