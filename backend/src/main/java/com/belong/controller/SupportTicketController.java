package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.*;
import com.belong.dto.response.TicketResponse;
import com.belong.service.SupportTicketService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class SupportTicketController {

    private final SupportTicketService ticketService;
    private final CurrentUserResolver resolver;

    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(ticketService.createTicket(resolver.getCurrentUserId(http), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> myTickets(HttpServletRequest http) {
        return ResponseEntity.ok(ticketService.getMyTickets(resolver.getCurrentUserId(http)));
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<TicketResponse>> societyTickets(@PathVariable Long societyId) {
        return ResponseEntity.ok(ticketService.getSocietyTickets(societyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicket(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.updateStatus(id, body.get("status")));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketResponse> addComment(@PathVariable Long id,
            @Valid @RequestBody CommentRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(ticketService.addComment(id, resolver.getCurrentUserId(http), req));
    }
}
