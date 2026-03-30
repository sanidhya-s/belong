package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "societies")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Society {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    private String address, city, state, pincode;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); }
}
