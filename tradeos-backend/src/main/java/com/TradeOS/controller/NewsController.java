package com.TradeOS.controller;

import com.TradeOS.service.NewsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public Map getNews() {

        return newsService.getCryptoNews();
    }
}