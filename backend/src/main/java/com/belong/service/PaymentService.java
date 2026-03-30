package com.belong.service;

import com.belong.dto.request.PaymentRequest;
import com.belong.dto.response.PaymentResponse;
import com.belong.entity.*;
import com.belong.exception.AppException;
import com.belong.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;

    /** Admin creates a dues entry */
    public PaymentResponse createDue(PaymentRequest req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Payment payment = Payment.builder()
                .user(user).society(user.getSociety())
                .description(req.getDescription())
                .type(Payment.Type.valueOf(req.getType().toUpperCase()))
                .amount(req.getAmount())
                .dueDate(req.getDueDate())
                .status(Payment.Status.DUE)
                .build();
        return toResponse(paymentRepo.save(payment));
    }

    /** Resident initiates payment */
    public PaymentResponse payDue(Long paymentId, Long userId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new AppException("Payment not found", HttpStatus.NOT_FOUND));
        if (!payment.getUser().getId().equals(userId))
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        if (payment.getStatus() == Payment.Status.PAID)
            throw new AppException("Already paid", HttpStatus.CONFLICT);
        // In production: integrate Razorpay/Paytm, verify webhook then mark paid
        payment.setStatus(Payment.Status.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return toResponse(paymentRepo.save(payment));
    }

    public List<PaymentResponse> getMyPayments(Long userId) {
        return paymentRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PaymentResponse> getMyDues(Long userId) {
        return paymentRepo.findByUserIdAndStatus(userId, Payment.Status.DUE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId()).description(p.getDescription())
                .type(p.getType().name()).status(p.getStatus().name())
                .amount(p.getAmount()).dueDate(p.getDueDate())
                .paidAt(p.getPaidAt()).transactionId(p.getTransactionId())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
