package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gate_passes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class GatePass {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) private String passCode;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "visitor_id") private Visitor visitor;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "resident_id") private User resident;
    private LocalDateTime validFrom, validUntil;
    @Column(columnDefinition = "TEXT") private String qrCodeBase64;
    private boolean used;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); this.used = false; }
}
