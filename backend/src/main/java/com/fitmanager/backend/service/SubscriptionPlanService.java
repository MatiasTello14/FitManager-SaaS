package com.fitmanager.backend.service;

import com.fitmanager.backend.dto.SubscriptionPlanDTO;
import com.fitmanager.backend.model.Gym;
import com.fitmanager.backend.model.SubscriptionPlan;
import com.fitmanager.backend.repository.GymRepository;
import com.fitmanager.backend.repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubscriptionPlanService {

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private GymRepository gymRepository;

    public SubscriptionPlan savePlan(SubscriptionPlanDTO dto, Long gymId) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(dto.getName());
        plan.setPrice(dto.getPrice());
        plan.setDurationDays(dto.getDurationDays());
        plan.setDescription(dto.getDescription());
        plan.setGym(gym);

        return planRepository.save(plan);
    }

    public List<SubscriptionPlan> getPlansByGym(Long gymId) {
        return planRepository.findByGymId(gymId);
    }
}