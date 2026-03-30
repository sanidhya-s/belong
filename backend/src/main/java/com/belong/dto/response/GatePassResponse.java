package com.belong.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class GatePassResponse {
    private Long id;
    private String passCode, qrCodeBase64;
    private String visitorName, visitorPhone;
    private LocalDateTime validFrom, validUntil;
    private boolean used;
}
