package com.belong.repository;

import com.belong.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findBySocietyIdOrderByPinnedDescCreatedAtDesc(Long societyId);
}
