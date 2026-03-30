package com.belong.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "security_contacts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SecurityContact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name, phone, designation, shift, photoUrl;
    @Enumerated(EnumType.STRING) private Type type;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "society_id") private Society society;
    public enum Type { GUARD, EMERGENCY, HELPDESK }
}
