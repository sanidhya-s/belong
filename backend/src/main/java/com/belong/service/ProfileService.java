package com.belong.service;

import com.belong.dto.request.UpdateProfileRequest;
import com.belong.dto.response.AuthResponse;
import com.belong.entity.User;
import com.belong.exception.AppException;
import com.belong.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepo;

    public AuthResponse getProfile(Long userId) {
        User u = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return AuthResponse.builder()
                .userId(u.getId()).phone(u.getPhone()).name(u.getName())
                .role(u.getRole().name()).newUser(false)
                .build();
    }

    public AuthResponse updateProfile(Long userId, UpdateProfileRequest req) {
        User u = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        if (req.getName() != null) u.setName(req.getName());
        if (req.getEmail() != null) u.setEmail(req.getEmail());
        if (req.getAvatarUrl() != null) u.setAvatarUrl(req.getAvatarUrl());
        userRepo.save(u);
        return getProfile(userId);
    }
}
