package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class TicketRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotNull private String category;
    private String priority;
}
