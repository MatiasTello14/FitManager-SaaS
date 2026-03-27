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

        String nombreNormalizado = dto.getName().trim().toLowerCase();

        return planRepository.findByNameIgnoreCaseAndGymId(nombreNormalizado, gymId)
                .map(existingPlan -> {
                    // 2. Reactivación y actualización
                    existingPlan.setPrice(dto.getPrice());
                    existingPlan.setDurationDays(dto.getDurationDays());
                    existingPlan.setDescription(dto.getDescription());
                    existingPlan.setActive(true);
                    existingPlan.setName(dto.getName());
                    return planRepository.save(existingPlan);
                })
                .orElseGet(() -> {
                    SubscriptionPlan newPlan = new SubscriptionPlan();
                    newPlan.setName(dto.getName());
                    newPlan.setPrice(dto.getPrice());
                    newPlan.setDurationDays(dto.getDurationDays());
                    newPlan.setDescription(dto.getDescription());
                    newPlan.setGym(gym);
                    newPlan.setActive(true);
                    return planRepository.save(newPlan);
                });
    }

    public List<SubscriptionPlan> getPlansByGym(Long gymId) {

        return planRepository.findByGymIdAndActiveTrue(gymId);
    }

    public void deletePlan(Long id) {

        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El plan no existe"));

        // SOFT DELETE: En lugar de borrar de la DB, lo desactivamos
        plan.setActive(false);
        planRepository.save(plan);
    }
}