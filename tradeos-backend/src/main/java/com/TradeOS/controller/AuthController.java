package com.TradeOS.controller;

import com.TradeOS.dto.LoginRequest;
import com.TradeOS.dto.RegisterRequest;
import com.TradeOS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return userService.registerUser(request);

    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return userService.loginUser(request);

    }
}