package com.belong.repository;

import com.belong.entity.GatePass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, Long> {
    Optional<GatePass> findByPassCode(String passCode);
    List<GatePass> findByResidentIdOrderByCreatedAtDesc(Long residentId);
}
