package com.belong.dto.request;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String avatarUrl;
}
