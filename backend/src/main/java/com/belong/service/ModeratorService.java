package com.belong.service;

import com.belong.dto.request.CreateMemberRequest;
import com.belong.dto.response.MemberResponse;
import com.belong.entity.Unit;
import com.belong.entity.User;
import com.belong.exception.AppException;
import com.belong.repository.UnitRepository;
import com.belong.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModeratorService {

    private final UserRepository userRepository;
    private final UnitRepository unitRepository;

    public List<MemberResponse> getMembers(Long currentUserId) {
        User moderator = getModerator(currentUserId);
        if (moderator.getSociety() == null) {
            throw new AppException("Moderator is not mapped to a society", HttpStatus.BAD_REQUEST);
        }

        return userRepository.findBySocietyIdOrderByCreatedAtDesc(moderator.getSociety().getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MemberResponse addMember(Long currentUserId, CreateMemberRequest req) {
        User moderator = getModerator(currentUserId);
        if (moderator.getSociety() == null) {
            throw new AppException("Moderator is not mapped to a society", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new AppException("Phone already registered", HttpStatus.BAD_REQUEST);
        }

        Unit unit = null;
        if (req.getUnitId() != null) {
            unit = unitRepository.findByIdAndSocietyId(req.getUnitId(), moderator.getSociety().getId())
                    .orElseThrow(() -> new AppException("Unit not found for this society", HttpStatus.BAD_REQUEST));
        }

        User.Role role = parseRole(req.getRole());

        User newMember = User.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .role(role)
                .society(moderator.getSociety())
                .unit(unit)
                .build();

        return toResponse(userRepository.save(newMember));
    }

    private User getModerator(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (user.getRole() != User.Role.MODERATOR && user.getRole() != User.Role.ADMIN) {
            throw new AppException("Only moderator can manage members", HttpStatus.FORBIDDEN);
        }
        return user;
    }

    private MemberResponse toResponse(User user) {
        return MemberResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole() == null ? User.Role.RESIDENT.name() : user.getRole().name())
                .unit(user.getUnit() == null ? null : user.getUnit().getNumber())
                .active(user.isActive())
                .build();
    }

    private User.Role parseRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return User.Role.RESIDENT;
        }
        try {
            return User.Role.valueOf(rawRole.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new AppException("Invalid role: " + rawRole, HttpStatus.BAD_REQUEST);
        }
    }
}
