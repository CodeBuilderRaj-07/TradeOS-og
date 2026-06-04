package com.TradeOS.security;

import com.TradeOS.entity.User;
import com.TradeOS.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            String provider = token.getAuthorizedClientRegistrationId().toUpperCase();

            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String providerId = oAuth2User.getAttribute("sub");

            if (email == null) {
                response.sendRedirect(frontendUrl + "/oauth/callback?error=" +
                        URLEncoder.encode("Email not provided by " + provider, StandardCharsets.UTF_8));
                return;
            }

            User user = userRepository.findByEmail(email);

            if (user == null) {
                user = new User();
                user.setFullName(name != null ? name : email);
                user.setEmail(email);
                user.setPassword(null);
                user.setRole("TRADER");
                user.setAuthProvider(provider);
                user.setProviderId(providerId);
                userRepository.save(user);
            } else {
                if (user.getAuthProvider() == null) {
                    user.setAuthProvider(provider);
                    user.setProviderId(providerId);
                    userRepository.save(user);
                }
            }

            String jwt = jwtUtil.generateToken(user.getEmail());

            response.sendRedirect(frontendUrl + "/oauth/callback?token=" + jwt);
        } catch (Exception e) {
            try {
                response.sendRedirect(frontendUrl + "/oauth/callback?error=" +
                        URLEncoder.encode(e.getClass().getSimpleName() + ": " + e.getMessage(), StandardCharsets.UTF_8));
            } catch (IOException ignored) {}
        }
    }
}
