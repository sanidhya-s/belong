package com.belong.repository;

import com.belong.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByResidentIdOrderByCreatedAtDesc(Long residentId);
    List<Visitor> findByResidentSocietyIdOrderByCreatedAtDesc(Long societyId);
}
