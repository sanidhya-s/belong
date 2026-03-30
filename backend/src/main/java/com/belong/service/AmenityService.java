package com.belong.service;

import com.belong.dto.request.BookAmenityRequest;
import com.belong.dto.response.*;
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
public class AmenityService {

    private final AmenityRepository amenityRepo;
    private final AmenityBookingRepository bookingRepo;
    private final UserRepository userRepo;

    public List<AmenityResponse> getAmenities(Long societyId) {
        return amenityRepo.findBySocietyId(societyId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse bookAmenity(Long userId, BookAmenityRequest req) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Amenity amenity = amenityRepo.findById(req.getAmenityId()).orElseThrow(() -> new AppException("Amenity not found", HttpStatus.NOT_FOUND));

        if (!amenity.isAvailable()) throw new AppException("Amenity is not available", HttpStatus.CONFLICT);

        List<AmenityBooking> conflicts = bookingRepo.findConflictingBookings(
                amenity.getId(), req.getBookingDate(), req.getStartTime(), req.getEndTime());
        if (!conflicts.isEmpty()) throw new AppException("Slot already booked", HttpStatus.CONFLICT);

        AmenityBooking booking = AmenityBooking.builder()
                .amenity(amenity)
                .user(user)
                .bookingDate(req.getBookingDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .build();

        return toBookingResponse(bookingRepo.save(booking));
    }

    public List<BookingResponse> getMyBookings(Long userId) {
        return bookingRepo.findByUserId(userId).stream().map(this::toBookingResponse).collect(Collectors.toList());
    }

    public void cancelBooking(Long bookingId, Long userId) {
        AmenityBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new AppException("Booking not found", HttpStatus.NOT_FOUND));
        if (!booking.getUser().getId().equals(userId))
            throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        booking.setStatus(AmenityBooking.Status.CANCELLED);
        bookingRepo.save(booking);
    }

    private AmenityResponse toResponse(Amenity a) {
        return AmenityResponse.builder()
                .id(a.getId()).name(a.getName()).description(a.getDescription())
                .iconName(a.getIconName()).imageUrl(a.getImageUrl())
                .openTime(a.getOpenTime()).closeTime(a.getCloseTime())
                .maxCapacity(a.getMaxCapacity()).available(a.isAvailable())
                .build();
    }

    private BookingResponse toBookingResponse(AmenityBooking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .amenityName(b.getAmenity().getName())
                .amenityIcon(b.getAmenity().getIconName())
                .status(b.getStatus().name())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .userName(b.getUser().getName())
                .build();
    }
}
