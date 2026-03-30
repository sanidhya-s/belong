package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "community_posts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityPost {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT") private String content;
    private String imageUrl;
    @Enumerated(EnumType.STRING) private Category category;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    private int likesCount;
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL) private List<PostComment> comments;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); }
    public enum Category { GENERAL, ANNOUNCEMENT, LOST_FOUND, FOR_SALE, HELP, EVENT }
}
