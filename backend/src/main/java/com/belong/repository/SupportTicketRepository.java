package com.belong.repository;

import com.belong.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByRaisedByIdOrderByCreatedAtDesc(Long userId);
    List<SupportTicket> findBySocietyIdOrderByCreatedAtDesc(Long societyId);
}
