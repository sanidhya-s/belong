package com.belong.repository;

import com.belong.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findBySocietyIdOrderByCreatedAtDesc(Long societyId);
    List<CommunityPost> findBySocietyIdAndCategoryOrderByCreatedAtDesc(Long societyId, CommunityPost.Category category);
}
