package com.belong.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMemberRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    private String email;
    private Long unitId;
    private String role;
}
