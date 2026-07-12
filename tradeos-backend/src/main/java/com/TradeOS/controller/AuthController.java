package com.TradeOS.controller;

import com.TradeOS.dto.LoginRequest;
import com.TradeOS.dto.RegisterRequest;
import com.TradeOS.security.JwtUtil;
import com.TradeOS.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @Value("${GOOGLE_CLIENT_SECRET}")
    private String googleClientSecret;

    @Value("${GITHUB_CLIENT_ID:}")
    private String githubClientId;

    @Value("${GITHUB_CLIENT_SECRET:}")
    private String githubClientSecret;

    @Value("${FRONTEND_URL:https://tradeos-frontend.onrender.com}")
    private String frontendUrl;

    private final WebClient webClient;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.webClient = WebClient.create();
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

    @PostMapping("/generate-token")
    public Map<String, Object> generateApiToken(HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        if (email == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                email = jwtUtil.extractEmail(authHeader.substring(7));
            }
        }
        String token = userService.generateApiToken(email);
        Map<String, Object> res = new HashMap<>();
        if (token == null) {
            res.put("error", "User not found");
            return res;
        }
        res.put("apiToken", token);
        return res;
    }

    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> body) {
        return userService.forgotPassword(body.getOrDefault("email", ""));
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> body) {
        return userService.verifyOtp(
                body.getOrDefault("email", ""),
                body.getOrDefault("otp", "")
        );
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> body) {
        return userService.resetPassword(
                body.getOrDefault("token", ""),
                body.getOrDefault("newPassword", "")
        );
    }

    @PostMapping("/oauth/google")
    public Map<String, Object> googleOAuth(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            String code = body.get("code");
            if (code == null || code.isBlank()) {
                result.put("error", "Authorization code is required");
                return result;
            }

            MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
            tokenBody.add("code", code);
            tokenBody.add("client_id", googleClientId);
            tokenBody.add("client_secret", googleClientSecret);
            tokenBody.add("redirect_uri", frontendUrl + "/oauth/callback");
            tokenBody.add("grant_type", "authorization_code");

            Map tokenResponse = webClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(tokenBody))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (tokenResponse == null || tokenResponse.get("access_token") == null) {
                result.put("error", "Failed to exchange authorization code");
                return result;
            }

            String accessToken = (String) tokenResponse.get("access_token");

            Map userInfo = webClient.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (userInfo == null) {
                result.put("error", "Failed to fetch user info from Google");
                return result;
            }

            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String providerId = (String) userInfo.get("sub");

            if (email == null) {
                result.put("error", "Email not provided by Google");
                return result;
            }

            return userService.handleOAuthLogin("GOOGLE", providerId, email, name);
        } catch (Exception e) {
            result.put("error", "OAuth failed: " + e.getMessage());
            return result;
        }
    }

    @PostMapping("/oauth/github")
    public Map<String, Object> githubOAuth(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            String code = body.get("code");
            if (code == null || code.isBlank()) {
                result.put("error", "Authorization code is required");
                return result;
            }

            if (githubClientId == null || githubClientId.isBlank()) {
                result.put("error", "GitHub sign in not configured");
                return result;
            }

            MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
            tokenBody.add("client_id", githubClientId);
            tokenBody.add("client_secret", githubClientSecret);
            tokenBody.add("code", code);
            tokenBody.add("redirect_uri", frontendUrl + "/oauth/callback");

            Map tokenResponse = webClient.post()
                    .uri("https://github.com/login/oauth/access_token")
                    .header("Accept", "application/json")
                    .body(BodyInserters.fromFormData(tokenBody))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (tokenResponse == null || tokenResponse.get("access_token") == null) {
                result.put("error", "Failed to exchange authorization code");
                return result;
            }

            String accessToken = (String) tokenResponse.get("access_token");

            Map userInfo = webClient.get()
                    .uri("https://api.github.com/user")
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (userInfo == null) {
                result.put("error", "Failed to fetch user info from GitHub");
                return result;
            }

            String githubId = String.valueOf(userInfo.get("id"));
            String name = (String) userInfo.get("name");
            String email = (String) userInfo.get("email");

            if (email == null) {
                Map emailsResponse = webClient.get()
                        .uri("https://api.github.com/user/emails")
                        .header("Authorization", "Bearer " + accessToken)
                        .header("Accept", "application/json")
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

                if (emailsResponse instanceof java.util.List) {
                    java.util.List<Map<String, Object>> emails = (java.util.List<Map<String, Object>>) emailsResponse;
                    for (Map<String, Object> e : emails) {
                        if (Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified"))) {
                            email = (String) e.get("email");
                            break;
                        }
                    }
                }
            }

            if (email == null) {
                result.put("error", "Email not provided by GitHub");
                return result;
            }

            if (name == null || name.isBlank()) {
                name = (String) userInfo.get("login");
            }

            return userService.handleOAuthLogin("GITHUB", githubId, email, name);
        } catch (Exception e) {
            result.put("error", "OAuth failed: " + e.getMessage());
            return result;
        }
    }
}