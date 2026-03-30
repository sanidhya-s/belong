package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "amenities")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Amenity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    private String description, iconName, imageUrl;
    private String openTime, closeTime;  // "06:00", "22:00"
    private Integer maxCapacity;
    private boolean available;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    @PrePersist void prePersist() { this.available = true; }
}
