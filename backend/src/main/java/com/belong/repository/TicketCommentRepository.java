package com.belong.repository;
import com.belong.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {}
