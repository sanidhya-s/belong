package com.belong.service;

import com.belong.dto.response.SecurityContactResponse;
import com.belong.repository.SecurityContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final SecurityContactRepository securityContactRepo;

    public List<SecurityContactResponse> getContacts(Long societyId) {
        return securityContactRepo.findBySocietyId(societyId).stream()
                .map(c -> SecurityContactResponse.builder()
                        .id(c.getId()).name(c.getName()).phone(c.getPhone())
                        .designation(c.getDesignation()).shift(c.getShift())
                        .photoUrl(c.getPhotoUrl()).type(c.getType().name())
                        .build())
                .collect(Collectors.toList());
    }
}
