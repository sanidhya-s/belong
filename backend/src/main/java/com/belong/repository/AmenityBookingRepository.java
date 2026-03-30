package com.belong.repository;

import com.belong.entity.AmenityBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AmenityBookingRepository extends JpaRepository<AmenityBooking, Long> {
    List<AmenityBooking> findByUserId(Long userId);
    List<AmenityBooking> findByAmenityId(Long amenityId);

    @Query("SELECT b FROM AmenityBooking b WHERE b.amenity.id = :amenityId AND b.bookingDate = :date AND b.status = 'CONFIRMED' AND NOT (b.endTime <= :start OR b.startTime >= :end)")
    List<AmenityBooking> findConflictingBookings(Long amenityId, LocalDate date, LocalTime start, LocalTime end);
}
