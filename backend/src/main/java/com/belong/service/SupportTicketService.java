package com.belong.service;

import com.belong.dto.request.*;
import com.belong.dto.response.TicketResponse;
import com.belong.entity.*;
import com.belong.exception.AppException;
import com.belong.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private final SupportTicketRepository ticketRepo;
    private final TicketCommentRepository commentRepo;
    private final UserRepository userRepo;

    public TicketResponse createTicket(Long userId, TicketRequest req) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        SupportTicket ticket = SupportTicket.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .category(SupportTicket.Category.valueOf(req.getCategory().toUpperCase()))
                .priority(req.getPriority() != null ? SupportTicket.Priority.valueOf(req.getPriority().toUpperCase()) : SupportTicket.Priority.MEDIUM)
                .raisedBy(user)
                .society(user.getSociety())
                .build();
        return toResponse(ticketRepo.save(ticket));
    }

    public List<TicketResponse> getMyTickets(Long userId) {
        return ticketRepo.findByRaisedByIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TicketResponse> getSocietyTickets(Long societyId) {
        return ticketRepo.findBySocietyIdOrderByCreatedAtDesc(societyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TicketResponse getTicket(Long ticketId) {
        return toResponse(ticketRepo.findById(ticketId)
                .orElseThrow(() -> new AppException("Ticket not found", HttpStatus.NOT_FOUND)));
    }

    public TicketResponse updateStatus(Long ticketId, String status) {
        SupportTicket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new AppException("Ticket not found", HttpStatus.NOT_FOUND));
        ticket.setStatus(SupportTicket.Status.valueOf(status.toUpperCase()));
        if (ticket.getStatus() == SupportTicket.Status.RESOLVED)
            ticket.setResolvedAt(LocalDateTime.now());
        return toResponse(ticketRepo.save(ticket));
    }

    public TicketResponse addComment(Long ticketId, Long userId, CommentRequest req) {
        SupportTicket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new AppException("Ticket not found", HttpStatus.NOT_FOUND));
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        TicketComment comment = TicketComment.builder().ticket(ticket).user(user).content(req.getContent()).build();
        commentRepo.save(comment);
        return toResponse(ticketRepo.findById(ticketId).get());
    }

    private TicketResponse toResponse(SupportTicket t) {
        String unit = t.getRaisedBy().getUnit() != null ? t.getRaisedBy().getUnit().getNumber() : null;
        List<TicketResponse.CommentResponse> comments = t.getComments() == null ? List.of() :
                t.getComments().stream().map(c -> TicketResponse.CommentResponse.builder()
                        .id(c.getId()).content(c.getContent())
                        .userName(c.getUser().getName()).createdAt(c.getCreatedAt()).build())
                        .collect(Collectors.toList());
        return TicketResponse.builder()
                .id(t.getId()).title(t.getTitle()).description(t.getDescription())
                .category(t.getCategory().name()).status(t.getStatus().name()).priority(t.getPriority().name())
                .raisedByName(t.getRaisedBy().getName()).raisedByUnit(unit)
                .comments(comments)
                .createdAt(t.getCreatedAt()).updatedAt(t.getUpdatedAt()).resolvedAt(t.getResolvedAt())
                .build();
    }
}
