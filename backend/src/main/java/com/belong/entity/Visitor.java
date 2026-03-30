package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Visitor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    private String phone, purpose, vehicleNumber, photoUrl;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "resident_id", nullable = false) private User resident;
    @Enumerated(EnumType.STRING) private Status status;
    private LocalDateTime expectedArrival;
    private LocalDateTime checkIn, checkOut;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); this.status = Status.PENDING; }
    public enum Status { PENDING, APPROVED, DENIED, CHECKED_IN, CHECKED_OUT }
}
