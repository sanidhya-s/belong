package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class SendOtpRequest {
    @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian phone number")
    private String phone;
}
