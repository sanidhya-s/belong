package com.belong.dto.response;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String phone;
    private Long userId;
    private String name;
    private String role;
    private boolean newUser;
}
