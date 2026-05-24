package com.TradeOS.service;

import com.TradeOS.dto.LoginRequest;
import com.TradeOS.dto.RegisterRequest;
import com.TradeOS.entity.User;
import com.TradeOS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.TradeOS.security.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(RegisterRequest request) {

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public String loginUser(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail());

    if (user == null) {
        return "User Not Found";
    }

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    boolean matches = passwordEncoder.matches(
            request.getPassword(),
            user.getPassword()
    );

    if (!matches) {
        return "Invalid Password";
    }

    String token = JwtUtil.generateToken(user.getEmail());

    return token;
}
}