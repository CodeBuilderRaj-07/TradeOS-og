package com.TradeOS.service;

import com.TradeOS.dto.LoginRequest;
import com.TradeOS.dto.RegisterRequest;
import com.TradeOS.entity.User;
import com.TradeOS.repository.UserRepository;
import com.TradeOS.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> handleOAuthLogin(String provider, String providerId, String email, String name) {
        Map<String, Object> result = new HashMap<>();

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

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("fullName", user.getFullName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());

        result.put("token", token);
        result.put("user", userMap);

        return result;
    }

    public String registerUser(RegisterRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("TRADER");
        userRepository.save(user);
        return "User Registered Successfully";
    }

    public Map<String, Object> loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        Map<String, Object> result = new HashMap<>();

        if (user == null) {
            result.put("error", "User Not Found");
            return result;
        }

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!matches) {
            result.put("error", "Invalid Password");
            return result;
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("fullName", user.getFullName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());

        result.put("token", token);
        result.put("user", userMap);

        return result;
    }

    public Map<String, Object> getUserProfile(String email) {
        User user = userRepository.findByEmail(email);
        Map<String, Object> profile = new HashMap<>();
        if (user == null) {
            profile.put("error", "User not found");
            return profile;
        }
        profile.put("fullName", user.getFullName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        return profile;
    }

    public String updateProfile(String email, String fullName) {
        User user = userRepository.findByEmail(email);
        if (user == null) return "User not found";
        user.setFullName(fullName);
        userRepository.save(user);
        return "Profile updated successfully";
    }

    public Map<String, Object> forgotPassword(String email) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            result.put("error", "User not found with this email");
            return result;
        }

        String resetToken = java.util.UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        userRepository.save(user);

        result.put("success", true);
        result.put("message", "Reset token generated. In production, this would be emailed.");
        result.put("resetToken", resetToken);
        return result;
    }

    public String generateApiToken(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) return null;
        String token = java.util.UUID.randomUUID().toString().replace("-", "") +
                       java.util.UUID.randomUUID().toString().replace("-", "");
        user.setApiToken(token);
        userRepository.save(user);
        return token;
    }

    public User getUserByApiToken(String apiToken) {
        if (apiToken == null || apiToken.isBlank()) return null;
        return userRepository.findByApiToken(apiToken);
    }

    public Map<String, Object> resetPassword(String token, String newPassword) {
        Map<String, Object> result = new HashMap<>();

        User user = userRepository.findByResetToken(token);

        if (user == null) {
            result.put("error", "Invalid or expired reset token");
            return result;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);

        result.put("success", true);
        result.put("message", "Password reset successfully");
        return result;
    }
}