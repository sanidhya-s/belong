package com.belong.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class NoticeRequest {
    @NotBlank private String title;
    @NotBlank private String content;
    @NotNull private String category;
    private boolean pinned;
    private LocalDateTime expiresAt;
}
