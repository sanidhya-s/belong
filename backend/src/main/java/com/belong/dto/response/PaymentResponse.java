package com.belong.dto.response;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String description, type, status, transactionId;
    private BigDecimal amount;
    private LocalDateTime dueDate, paidAt, createdAt;
}
