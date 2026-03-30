package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.BookAmenityRequest;
import com.belong.dto.response.*;
import com.belong.service.AmenityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;
    private final CurrentUserResolver resolver;

    @GetMapping("/societies/{societyId}/amenities")
    public ResponseEntity<List<AmenityResponse>> getAmenities(@PathVariable Long societyId) {
        return ResponseEntity.ok(amenityService.getAmenities(societyId));
    }

    @PostMapping("/amenities/book")
    public ResponseEntity<BookingResponse> book(@Valid @RequestBody BookAmenityRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(amenityService.bookAmenity(resolver.getCurrentUserId(http), req));
    }

    @GetMapping("/amenities/my-bookings")
    public ResponseEntity<List<BookingResponse>> myBookings(HttpServletRequest http) {
        return ResponseEntity.ok(amenityService.getMyBookings(resolver.getCurrentUserId(http)));
    }

    @DeleteMapping("/amenities/bookings/{bookingId}")
    public ResponseEntity<Void> cancel(@PathVariable Long bookingId, HttpServletRequest http) {
        amenityService.cancelBooking(bookingId, resolver.getCurrentUserId(http));
        return ResponseEntity.noContent().build();
    }
}
