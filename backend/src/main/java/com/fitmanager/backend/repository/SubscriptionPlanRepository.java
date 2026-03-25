package com.fitmanager.backend.repository;

import com.fitmanager.backend.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByGymId(Long gymId); // Para traer solo los planes de UN gimnasio
}
