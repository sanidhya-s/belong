package com.belong.dto.response;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PostResponse {
    private Long id;
    private String content, imageUrl, category;
    private String userName, userUnit, userAvatar;
    private int likesCount;
    private int commentsCount;
    private LocalDateTime createdAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CommentResponse {
        private Long id;
        private String content, userName;
        private LocalDateTime createdAt;
    }
}
