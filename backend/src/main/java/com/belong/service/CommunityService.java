package com.belong.service;

import com.belong.dto.request.*;
import com.belong.dto.response.PostResponse;
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
public class CommunityService {

    private final CommunityPostRepository postRepo;
    private final PostCommentRepository commentRepo;
    private final UserRepository userRepo;

    public PostResponse createPost(Long userId, PostRequest req) {
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        CommunityPost post = CommunityPost.builder()
                .content(req.getContent()).imageUrl(req.getImageUrl())
                .category(CommunityPost.Category.valueOf(req.getCategory().toUpperCase()))
                .user(user).society(user.getSociety())
                .build();
        return toResponse(postRepo.save(post));
    }

    public List<PostResponse> getSocietyPosts(Long societyId, String category) {
        List<CommunityPost> posts = category != null
                ? postRepo.findBySocietyIdAndCategoryOrderByCreatedAtDesc(societyId, CommunityPost.Category.valueOf(category.toUpperCase()))
                : postRepo.findBySocietyIdOrderByCreatedAtDesc(societyId);
        return posts.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PostResponse likePost(Long postId) {
        CommunityPost post = postRepo.findById(postId).orElseThrow(() -> new AppException("Post not found", HttpStatus.NOT_FOUND));
        post.setLikesCount(post.getLikesCount() + 1);
        return toResponse(postRepo.save(post));
    }

    public PostResponse addComment(Long postId, Long userId, CommentRequest req) {
        CommunityPost post = postRepo.findById(postId).orElseThrow(() -> new AppException("Post not found", HttpStatus.NOT_FOUND));
        User user = userRepo.findById(userId).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        PostComment comment = PostComment.builder().post(post).user(user).content(req.getContent()).build();
        commentRepo.save(comment);
        return toResponse(postRepo.findById(postId).get());
    }

    public void deletePost(Long postId, Long userId) {
        CommunityPost post = postRepo.findById(postId).orElseThrow(() -> new AppException("Post not found", HttpStatus.NOT_FOUND));
        if (!post.getUser().getId().equals(userId)) throw new AppException("Unauthorized", HttpStatus.FORBIDDEN);
        postRepo.delete(post);
    }

    private PostResponse toResponse(CommunityPost p) {
        String unit = p.getUser().getUnit() != null ? p.getUser().getUnit().getNumber() : null;
        int commentsCount = p.getComments() == null ? 0 : p.getComments().size();
        return PostResponse.builder()
                .id(p.getId()).content(p.getContent()).imageUrl(p.getImageUrl())
                .category(p.getCategory().name())
                .userName(p.getUser().getName()).userUnit(unit).userAvatar(p.getUser().getAvatarUrl())
                .likesCount(p.getLikesCount()).commentsCount(commentsCount)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
