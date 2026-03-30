package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class VisitorRequest {
    @NotBlank private String name;
    private String phone, purpose, vehicleNumber;
    private LocalDateTime expectedArrival;
    private Long residentId;
}
