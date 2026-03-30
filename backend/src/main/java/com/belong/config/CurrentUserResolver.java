package com.belong.config;

import com.belong.repository.UserRepository;
import com.belong.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserResolver {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public Long getCurrentUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return jwtUtil.extractUserId(authHeader.substring(7));
        }
        throw new RuntimeException("No auth token");
    }
}
