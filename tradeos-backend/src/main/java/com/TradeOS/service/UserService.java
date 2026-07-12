package com.TradeOS.service;

import com.TradeOS.dto.LoginRequest;
import com.TradeOS.dto.RegisterRequest;
import com.TradeOS.entity.User;
import com.TradeOS.repository.UserRepository;
import com.TradeOS.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;

    @Value("${tradeos.otp.expiry-minutes:15}")
    private int otpExpiryMinutes;

    @Value("${SMTP_USER:}")
    private String smtpUser;

    @Value("${FRONTEND_URL:https://tradeos-frontend.onrender.com}")
    private String frontendUrl;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
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

    public String generateApiToken(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) return null;
        String token = UUID.randomUUID().toString().replace("-", "") +
                       UUID.randomUUID().toString().replace("-", "");
        user.setApiToken(token);
        userRepository.save(user);
        return token;
    }

    public User getUserByApiToken(String apiToken) {
        if (apiToken == null || apiToken.isBlank()) return null;
        return userRepository.findByApiToken(apiToken);
    }

    public Map<String, Object> forgotPassword(String email) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            result.put("success", true);
            result.put("message", "If this email exists, a reset link has been sent.");
            return result;
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setResetToken(otp);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        userRepository.save(user);

        String body = "Your TradeOS password reset OTP is: " + otp + "\n\n" +
                      "This code expires in " + otpExpiryMinutes + " minutes.\n\n" +
                      "If you did not request this, please ignore this email.";

        boolean emailSent = false;
        if (smtpUser != null && !smtpUser.isBlank()) {
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(email);
                msg.setSubject("TradeOS Password Reset OTP");
                msg.setText(body);
                mailSender.send(msg);
                log.info("OTP email sent to {}", email);
                emailSent = true;
            } catch (Exception e) {
                log.warn("Failed to send OTP email to {}: {}", email, e.getMessage());
            }
        } else {
            log.info("OTP for {} (no SMTP): {}", email, otp);
        }

        result.put("success", true);
        result.put("message", emailSent ? "OTP sent to your email" : "OTP sent to your email");
        // Dev fallback: return OTP when SMTP not configured
        if (!emailSent && (smtpUser == null || smtpUser.isBlank())) {
            result.put("devOtp", otp);
        }
        return result;
    }

    public Map<String, Object> verifyOtp(String email, String otp) {
        Map<String, Object> result = new HashMap<>();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            result.put("error", "User not found");
            return result;
        }
        if (user.getResetToken() == null || !user.getResetToken().equals(otp)) {
            result.put("error", "Invalid OTP");
            return result;
        }
        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            result.put("error", "OTP has expired. Request a new one.");
            return result;
        }

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        userRepository.save(user);

        result.put("success", true);
        result.put("resetToken", resetToken);
        return result;
    }

    public Map<String, Object> resetPassword(String token, String newPassword) {
        Map<String, Object> result = new HashMap<>();

        User user = userRepository.findByResetToken(token);

        if (user == null) {
            result.put("error", "Invalid or expired reset link");
            return result;
        }

        if (user.getResetTokenExpiry() != null && LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            result.put("error", "Reset link expired. Please request a new one.");
            return result;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        result.put("success", true);
        result.put("message", "Password reset successfully");
        return result;
    }
}
