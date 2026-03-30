package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class BookAmenityRequest {
    @NotNull private Long amenityId;
    @NotNull private LocalDate bookingDate;
    @NotNull private LocalTime startTime;
    @NotNull private LocalTime endTime;
}
