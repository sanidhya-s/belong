package com.belong.service;

import com.belong.dto.response.GatePassResponse;
import com.belong.entity.*;
import com.belong.exception.AppException;
import com.belong.repository.*;
import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GatePassService {

    private final GatePassRepository gatePassRepo;
    private final VisitorRepository visitorRepo;
    private final UserRepository userRepo;

    public GatePassResponse generateGatePass(Long residentId, Long visitorId) {
        User resident = userRepo.findById(residentId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Visitor visitor = visitorRepo.findById(visitorId)
                .orElseThrow(() -> new AppException("Visitor not found", HttpStatus.NOT_FOUND));
        if (!visitor.getResident().getId().equals(residentId))
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);

        String passCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        String qrData = String.format("{\"pass\":\"%s\",\"visitor\":\"%s\",\"resident\":\"%s\"}",
                passCode, visitor.getName(), resident.getName());
        String qrBase64 = generateQrBase64(qrData);

        GatePass pass = GatePass.builder()
                .passCode(passCode)
                .visitor(visitor)
                .resident(resident)
                .validFrom(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusHours(24))
                .qrCodeBase64(qrBase64)
                .build();

        return toResponse(gatePassRepo.save(pass));
    }

    public GatePassResponse verifyPass(String passCode) {
        GatePass pass = gatePassRepo.findByPassCode(passCode)
                .orElseThrow(() -> new AppException("Invalid pass code", HttpStatus.NOT_FOUND));
        if (pass.getValidUntil().isBefore(LocalDateTime.now()))
            throw new AppException("Gate pass has expired", HttpStatus.GONE);
        return toResponse(pass);
    }

    public List<GatePassResponse> getMyPasses(Long residentId) {
        return gatePassRepo.findByResidentIdOrderByCreatedAtDesc(residentId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String generateQrBase64(String data) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(data, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            return "";
        }
    }

    private GatePassResponse toResponse(GatePass p) {
        return GatePassResponse.builder()
                .id(p.getId()).passCode(p.getPassCode()).qrCodeBase64(p.getQrCodeBase64())
                .visitorName(p.getVisitor() != null ? p.getVisitor().getName() : null)
                .visitorPhone(p.getVisitor() != null ? p.getVisitor().getPhone() : null)
                .validFrom(p.getValidFrom()).validUntil(p.getValidUntil()).used(p.isUsed())
                .build();
    }
}
