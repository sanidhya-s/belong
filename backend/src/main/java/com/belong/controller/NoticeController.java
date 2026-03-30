package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.NoticeRequest;
import com.belong.dto.response.NoticeResponse;
import com.belong.service.NoticeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;
    private final CurrentUserResolver resolver;

    @PostMapping("/societies/{societyId}/notices")
    public ResponseEntity<NoticeResponse> create(@PathVariable Long societyId,
            @Valid @RequestBody NoticeRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(noticeService.createNotice(resolver.getCurrentUserId(http), societyId, req));
    }

    @GetMapping("/societies/{societyId}/notices")
    public ResponseEntity<List<NoticeResponse>> getNotices(@PathVariable Long societyId) {
        return ResponseEntity.ok(noticeService.getSocietyNotices(societyId));
    }

    @DeleteMapping("/notices/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
