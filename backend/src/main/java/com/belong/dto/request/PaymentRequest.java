package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class PaymentRequest {
    @NotNull private Long userId;
    @NotBlank private String description;
    @NotNull private String type;
    @NotNull @Positive private BigDecimal amount;
    private LocalDateTime dueDate;
}
