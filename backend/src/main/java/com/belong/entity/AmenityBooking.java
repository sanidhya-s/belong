package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "amenity_bookings")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AmenityBooking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "amenity_id", nullable = false) private Amenity amenity;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private User user;
    private LocalDate bookingDate;
    private LocalTime startTime, endTime;
    @Enumerated(EnumType.STRING) private Status status;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); this.status = Status.CONFIRMED; }
    public enum Status { CONFIRMED, CANCELLED, COMPLETED }
}
