package com.belong.dto.response;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String title, description, category, status, priority;
    private String raisedByName, raisedByUnit;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt, updatedAt, resolvedAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CommentResponse {
        private Long id;
        private String content, userName;
        private LocalDateTime createdAt;
    }
}
