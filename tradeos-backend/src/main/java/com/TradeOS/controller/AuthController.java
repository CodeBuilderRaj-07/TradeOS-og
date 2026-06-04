package com.TradeOS.controller;

import com.TradeOS.dto.LoginRequest;
import com.TradeOS.dto.RegisterRequest;
import com.TradeOS.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return userService.getUserProfile(email);
    }

    @PutMapping("/profile")
    public String updateProfile(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return userService.updateProfile(email, body.getOrDefault("fullName", ""));
    }

    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> body) {
        return userService.forgotPassword(body.getOrDefault("email", ""));
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> body) {
        return userService.resetPassword(
                body.getOrDefault("token", ""),
                body.getOrDefault("newPassword", "")
        );
    }
}