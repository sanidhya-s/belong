package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CommentRequest {
    @NotBlank private String content;
}
