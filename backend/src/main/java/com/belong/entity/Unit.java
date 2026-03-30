package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "units")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Unit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String number;
    private String block, floor;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;
}
