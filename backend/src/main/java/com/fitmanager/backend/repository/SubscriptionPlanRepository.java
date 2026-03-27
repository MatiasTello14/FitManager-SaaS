package com.fitmanager.backend.repository;

import com.fitmanager.backend.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByGymIdAndActiveTrue(Long gymId);
    Optional<SubscriptionPlan> findByNameIgnoreCaseAndGymId(String name, Long gymId);
}
