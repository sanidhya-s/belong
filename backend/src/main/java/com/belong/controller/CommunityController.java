package com.belong.controller;

import com.belong.config.CurrentUserResolver;
import com.belong.dto.request.*;
import com.belong.dto.response.PostResponse;
import com.belong.service.CommunityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;
    private final CurrentUserResolver resolver;

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> create(@Valid @RequestBody PostRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(communityService.createPost(resolver.getCurrentUserId(http), req));
    }

    @GetMapping("/societies/{societyId}/posts")
    public ResponseEntity<List<PostResponse>> getPosts(@PathVariable Long societyId,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(communityService.getSocietyPosts(societyId, category));
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<PostResponse> like(@PathVariable Long postId) {
        return ResponseEntity.ok(communityService.likePost(postId));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<PostResponse> addComment(@PathVariable Long postId,
            @Valid @RequestBody CommentRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(communityService.addComment(postId, resolver.getCurrentUserId(http), req));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId, HttpServletRequest http) {
        communityService.deletePost(postId, resolver.getCurrentUserId(http));
        return ResponseEntity.noContent().build();
    }
}
