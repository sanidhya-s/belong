package com.belong.controller;

import com.belong.dto.request.*;
import com.belong.dto.response.AuthResponse;
import com.belong.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody SendOtpRequest req) {
        authService.sendOtp(req);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(authService.verifyOtp(req));
    }
}
