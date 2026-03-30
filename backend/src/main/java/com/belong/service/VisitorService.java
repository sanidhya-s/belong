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

    public VisitorResponse addVisitor(Long requesterId, VisitorRequest req) {
        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        User resident = resolveResidentForVisitor(requester, req.getResidentId());
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
        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        validateVisitorAccess(visitor, requester);
        visitor.setStatus(Visitor.Status.valueOf(status.toUpperCase()));
        return toResponse(visitorRepo.save(visitor));
    }

    public List<com.belong.dto.response.MemberResponse> getResidentsForSecurity(Long requesterId) {
        User guard = userRepo.findById(requesterId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        if (guard.getRole() != User.Role.SECURITY_GUARD) {
            throw new AppException("Only security guards can view resident directory", HttpStatus.FORBIDDEN);
        }
        if (guard.getSociety() == null) {
            throw new AppException("Security guard is not mapped to a society", HttpStatus.BAD_REQUEST);
        }

        return userRepo.findBySocietyIdOrderByCreatedAtDesc(guard.getSociety().getId())
                .stream()
                .filter(user -> user.getRole() == User.Role.RESIDENT)
                .map(user -> com.belong.dto.response.MemberResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .phone(user.getPhone())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .unit(user.getUnit() == null ? null : user.getUnit().getNumber())
                        .active(user.isActive())
                        .build())
                .collect(Collectors.toList());
    }

    private User resolveResidentForVisitor(User requester, Long residentId) {
        if (requester.getRole() == User.Role.SECURITY_GUARD) {
            if (residentId == null) {
                throw new AppException("Resident is required for security-initiated visitor requests", HttpStatus.BAD_REQUEST);
            }
            User resident = userRepo.findById(residentId)
                    .orElseThrow(() -> new AppException("Resident not found", HttpStatus.NOT_FOUND));
            if (resident.getRole() != User.Role.RESIDENT) {
                throw new AppException("Selected member is not a resident", HttpStatus.BAD_REQUEST);
            }
            if (requester.getSociety() == null || resident.getSociety() == null ||
                    !requester.getSociety().getId().equals(resident.getSociety().getId())) {
                throw new AppException("Resident must belong to guard's society", HttpStatus.BAD_REQUEST);
            }
            return resident;
        }
        return requester;
    }

    private void validateVisitorAccess(Visitor visitor, User requester) {
        if (requester.getRole() == User.Role.SECURITY_GUARD) {
            if (requester.getSociety() == null ||
                    !requester.getSociety().getId().equals(visitor.getResident().getSociety().getId())) {
                throw new AppException("You cannot update this visitor", HttpStatus.FORBIDDEN);
            }
            return;
        }
        if (!visitor.getResident().getId().equals(requester.getId())) {
            throw new AppException("You cannot update this visitor", HttpStatus.FORBIDDEN);
        }
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
