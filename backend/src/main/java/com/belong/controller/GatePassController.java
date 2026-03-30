package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.response.GatePassResponse;
import com.belong.service.GatePassService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gate-passes")
@RequiredArgsConstructor
public class GatePassController {

    private final GatePassService gatePassService;
    private final CurrentUserResolver resolver;

    @PostMapping("/generate/{visitorId}")
    public ResponseEntity<GatePassResponse> generate(@PathVariable Long visitorId, HttpServletRequest http) {
        return ResponseEntity.ok(gatePassService.generateGatePass(resolver.getCurrentUserId(http), visitorId));
    }

    @GetMapping("/verify/{passCode}")
    public ResponseEntity<GatePassResponse> verify(@PathVariable String passCode) {
        return ResponseEntity.ok(gatePassService.verifyPass(passCode));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GatePassResponse>> myPasses(HttpServletRequest http) {
        return ResponseEntity.ok(gatePassService.getMyPasses(resolver.getCurrentUserId(http)));
    }
}
