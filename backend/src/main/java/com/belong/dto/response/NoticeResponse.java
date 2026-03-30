package com.belong.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NoticeResponse {
    private Long id;
    private String title, content, category;
    private boolean pinned;
    private String postedByName;
    private LocalDateTime expiresAt, createdAt;
}
