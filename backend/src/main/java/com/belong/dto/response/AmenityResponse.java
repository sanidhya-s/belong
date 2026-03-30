package com.belong.dto.response;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AmenityResponse {
    private Long id;
    private String name, description, iconName, imageUrl, openTime, closeTime;
    private Integer maxCapacity;
    private boolean available;
}
