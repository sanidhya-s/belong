package com.belong.dto.response;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SecurityContactResponse {
    private Long id;
    private String name, phone, designation, shift, photoUrl, type;
}
