package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    private String description;
    @Enumerated(EnumType.STRING) private Type type;
    @Enumerated(EnumType.STRING) private Status status;
    private BigDecimal amount;
    private LocalDateTime dueDate;
    private LocalDateTime paidAt;
    private String transactionId;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); }
    public enum Type { MAINTENANCE, PARKING, AMENITY, PENALTY, OTHER }
    public enum Status { DUE, PAID, OVERDUE, WAIVED }
}
