package com.belong.controller;

import com.belong.dto.response.SecurityContactResponse;
import com.belong.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/societies/{societyId}/security")
@RequiredArgsConstructor
public class SecurityController {

    private final SecurityService securityService;

    @GetMapping("/contacts")
    public ResponseEntity<List<SecurityContactResponse>> getContacts(@PathVariable Long societyId) {
        return ResponseEntity.ok(securityService.getContacts(societyId));
    }
}
