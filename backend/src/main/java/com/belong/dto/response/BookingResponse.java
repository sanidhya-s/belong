package com.belong.dto.response;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String amenityName, amenityIcon, status;
    private LocalDate bookingDate;
    private LocalTime startTime, endTime;
    private String userName;
}
