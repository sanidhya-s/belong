package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String content;
    @Enumerated(EnumType.STRING) private Category category;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "posted_by_id") private User postedBy;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    private LocalDateTime expiresAt;
    private boolean pinned;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); }
    public enum Category { GENERAL, EVENT, MAINTENANCE, EMERGENCY, RULE }
}
