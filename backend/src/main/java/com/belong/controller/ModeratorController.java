package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.CreateMemberRequest;
import com.belong.dto.response.MemberResponse;
import com.belong.service.ModeratorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderator/members")
@RequiredArgsConstructor
public class ModeratorController {

    private final ModeratorService moderatorService;
    private final CurrentUserResolver resolver;

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getMembers(HttpServletRequest http) {
        return ResponseEntity.ok(moderatorService.getMembers(resolver.getCurrentUserId(http)));
    }

    @PostMapping
    public ResponseEntity<MemberResponse> addMember(@Valid @RequestBody CreateMemberRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(moderatorService.addMember(resolver.getCurrentUserId(http), req));
    }
}
