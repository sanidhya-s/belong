package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class VerifyOtpRequest {
    @NotBlank private String phone;
    @NotBlank @Size(min=4, max=6) private String otp;
}
