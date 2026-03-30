package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) private String phone;
    private String name, email, avatarUrl;
    @Enumerated(EnumType.STRING) private Role role;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "unit_id") private Unit unit;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    private boolean active;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); this.active = true; }
    public enum Role { RESIDENT, MODERATOR, ADMIN, SECURITY_GUARD }
}
