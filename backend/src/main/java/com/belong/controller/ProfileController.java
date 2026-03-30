package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.UpdateProfileRequest;
import com.belong.dto.response.AuthResponse;
import com.belong.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final CurrentUserResolver resolver;

    @GetMapping
    public ResponseEntity<AuthResponse> getProfile(HttpServletRequest http) {
        return ResponseEntity.ok(profileService.getProfile(resolver.getCurrentUserId(http)));
    }

    @PatchMapping
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody UpdateProfileRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(profileService.updateProfile(resolver.getCurrentUserId(http), req));
    }
}
