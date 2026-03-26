package com.fitmanager.backend.repository;

import com.fitmanager.backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByGymId(Long gymId);

    boolean existsByDni(String dni);

    Optional<Member> findByDni(String dni);

}