package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.PaymentRequest;
import com.belong.dto.response.PaymentResponse;
import com.belong.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final CurrentUserResolver resolver;

    @PostMapping("/dues")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> createDue(@Valid @RequestBody PaymentRequest req) {
        return ResponseEntity.ok(paymentService.createDue(req));
    }

    @PostMapping("/{paymentId}/pay")
    public ResponseEntity<PaymentResponse> pay(@PathVariable Long paymentId, HttpServletRequest http) {
        return ResponseEntity.ok(paymentService.payDue(paymentId, resolver.getCurrentUserId(http)));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponse>> myPayments(HttpServletRequest http) {
        return ResponseEntity.ok(paymentService.getMyPayments(resolver.getCurrentUserId(http)));
    }

    @GetMapping("/my/dues")
    public ResponseEntity<List<PaymentResponse>> myDues(HttpServletRequest http) {
        return ResponseEntity.ok(paymentService.getMyDues(resolver.getCurrentUserId(http)));
    }
}
