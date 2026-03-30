package com.belong.service;

import com.belong.dto.request.NoticeRequest;
import com.belong.dto.response.NoticeResponse;
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
public class NoticeService {

    private final NoticeRepository noticeRepo;
    private final UserRepository userRepo;

    public NoticeResponse createNotice(Long adminId, Long societyId, NoticeRequest req) {
        User admin = userRepo.findById(adminId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        Notice notice = Notice.builder()
                .title(req.getTitle()).content(req.getContent())
                .category(Notice.Category.valueOf(req.getCategory().toUpperCase()))
                .pinned(req.isPinned()).expiresAt(req.getExpiresAt())
                .postedBy(admin)
                .society(admin.getSociety())
                .build();
        return toResponse(noticeRepo.save(notice));
    }

    public List<NoticeResponse> getSocietyNotices(Long societyId) {
        return noticeRepo.findBySocietyIdOrderByPinnedDescCreatedAtDesc(societyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void deleteNotice(Long noticeId) {
        noticeRepo.deleteById(noticeId);
    }

    private NoticeResponse toResponse(Notice n) {
        return NoticeResponse.builder()
                .id(n.getId()).title(n.getTitle()).content(n.getContent())
                .category(n.getCategory().name()).pinned(n.isPinned())
                .postedByName(n.getPostedBy() != null ? n.getPostedBy().getName() : null)
                .expiresAt(n.getExpiresAt()).createdAt(n.getCreatedAt())
                .build();
    }
}
