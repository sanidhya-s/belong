package com.belong.repository;

import com.belong.entity.SecurityContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SecurityContactRepository extends JpaRepository<SecurityContact, Long> {
    List<SecurityContact> findBySocietyId(Long societyId);
}
