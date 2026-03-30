package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "support_tickets")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SupportTicket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING) private Category category;
    @Enumerated(EnumType.STRING) private Status status;
    @Enumerated(EnumType.STRING) private Priority priority;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "raised_by_id") private User raisedBy;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL) private List<TicketComment> comments;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;
    @Column(name = "resolved_at") private LocalDateTime resolvedAt;
    @PrePersist void prePersist() { this.createdAt = LocalDateTime.now(); this.status = Status.OPEN; }
    @PreUpdate void preUpdate() { this.updatedAt = LocalDateTime.now(); }
    public enum Category { MAINTENANCE, SECURITY, HOUSEKEEPING, UTILITIES, PARKING, OTHER }
    public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
    public enum Priority { LOW, MEDIUM, HIGH, URGENT }
}
