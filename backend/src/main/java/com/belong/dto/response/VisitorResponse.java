package com.belong.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VisitorResponse {
    private Long id;
    private String name, phone, purpose, vehicleNumber, status;
    private LocalDateTime expectedArrival, checkIn, checkOut, createdAt;
    private String residentName, residentUnit;
}
