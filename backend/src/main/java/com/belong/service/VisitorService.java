package com.belong.service;

import com.belong.dto.request.VisitorRequest;
import com.belong.dto.response.VisitorResponse;
import com.belong.entity.*;
import com.belong.exception.AppException;
import com.belong.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepo;
    private final UserRepository userRepo;

    public VisitorResponse addVisitor(Long residentId, VisitorRequest req) {
        User resident = userRepo.findById(residentId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Visitor visitor = Visitor.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .purpose(req.getPurpose())
                .vehicleNumber(req.getVehicleNumber())
                .expectedArrival(req.getExpectedArrival())
                .resident(resident)
                .build();
        return toResponse(visitorRepo.save(visitor));
    }

    public List<VisitorResponse> getMyVisitors(Long residentId) {
        return visitorRepo.findByResidentIdOrderByCreatedAtDesc(residentId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<VisitorResponse> getSocietyVisitors(Long societyId) {
        return visitorRepo.findByResidentSocietyIdOrderByCreatedAtDesc(societyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public VisitorResponse updateStatus(Long visitorId, String status, Long requesterId) {
        Visitor visitor = visitorRepo.findById(visitorId)
                .orElseThrow(() -> new AppException("Visitor not found", HttpStatus.NOT_FOUND));
        visitor.setStatus(Visitor.Status.valueOf(status.toUpperCase()));
        return toResponse(visitorRepo.save(visitor));
    }

    private VisitorResponse toResponse(Visitor v) {
        String unit = v.getResident().getUnit() != null ? v.getResident().getUnit().getNumber() : null;
        return VisitorResponse.builder()
                .id(v.getId()).name(v.getName()).phone(v.getPhone())
                .purpose(v.getPurpose()).vehicleNumber(v.getVehicleNumber())
                .status(v.getStatus().name())
                .expectedArrival(v.getExpectedArrival())
                .checkIn(v.getCheckIn()).checkOut(v.getCheckOut())
                .createdAt(v.getCreatedAt())
                .residentName(v.getResident().getName())
                .residentUnit(unit)
                .build();
    }
}
