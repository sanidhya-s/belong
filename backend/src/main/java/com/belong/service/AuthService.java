package com.belong.service;

import com.belong.dto.request.*;
import com.belong.dto.response.AuthResponse;
import com.belong.entity.User;
import com.belong.exception.AppException;
import com.belong.repository.UserRepository;
import com.belong.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final CacheManager cacheManager;

    public void sendOtp(SendOtpRequest req) {
        // Demo-friendly OTP. Replace with SMS provider integration in production.
        String otp = "1234";
        Cache cache = cacheManager.getCache("otps");
        if (cache != null) cache.put(req.getPhone(), otp);
        log.info("OTP for {} : {}", req.getPhone(), otp);
    }

    public AuthResponse verifyOtp(VerifyOtpRequest req) {
        Cache cache = cacheManager.getCache("otps");
        if (cache == null) throw new AppException("OTP service unavailable", HttpStatus.INTERNAL_SERVER_ERROR);

        Cache.ValueWrapper wrapper = cache.get(req.getPhone());
        if (wrapper == null) throw new AppException("OTP expired or not sent", HttpStatus.BAD_REQUEST);

        String storedOtp = (String) wrapper.get();
        if (!storedOtp.equals(req.getOtp())) throw new AppException("Invalid OTP", HttpStatus.UNAUTHORIZED);

        cache.evict(req.getPhone());

        boolean isNewUser = !userRepository.existsByPhone(req.getPhone());
        User user = userRepository.findByPhone(req.getPhone()).orElseGet(() -> {
            User u = User.builder()
                    .phone(req.getPhone())
                    .role(User.Role.RESIDENT)
                    .build();
            return userRepository.save(u);
        });

        String token = jwtUtil.generateToken(user.getPhone(), user.getId());
        return AuthResponse.builder()
                .token(token)
                .phone(user.getPhone())
                .userId(user.getId())
                .name(user.getName())
                .role(user.getRole().name())
                .newUser(isNewUser)
                .build();
    }
}
