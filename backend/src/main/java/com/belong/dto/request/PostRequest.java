package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class PostRequest {
    @NotBlank private String content;
    private String imageUrl;
    @NotNull private String category;
}
