package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.VisitorRequest;
import com.belong.dto.response.VisitorResponse;
import com.belong.service.VisitorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;
    private final CurrentUserResolver resolver;

    @PostMapping
    public ResponseEntity<VisitorResponse> add(@Valid @RequestBody VisitorRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(visitorService.addVisitor(resolver.getCurrentUserId(http), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<VisitorResponse>> myVisitors(HttpServletRequest http) {
        return ResponseEntity.ok(visitorService.getMyVisitors(resolver.getCurrentUserId(http)));
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<VisitorResponse>> societyVisitors(@PathVariable Long societyId) {
        return ResponseEntity.ok(visitorService.getSocietyVisitors(societyId));
    }

    @PatchMapping("/{visitorId}/status")
    public ResponseEntity<VisitorResponse> updateStatus(@PathVariable Long visitorId,
            @RequestBody Map<String, String> body, HttpServletRequest http) {
        return ResponseEntity.ok(visitorService.updateStatus(visitorId, body.get("status"), resolver.getCurrentUserId(http)));
    }
}
