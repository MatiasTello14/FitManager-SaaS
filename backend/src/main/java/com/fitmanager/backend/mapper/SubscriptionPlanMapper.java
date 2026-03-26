package com.fitmanager.backend.mapper;

import com.fitmanager.backend.dto.SubscriptionPlanDTO;
import com.fitmanager.backend.model.SubscriptionPlan;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionPlanMapper {
    public SubscriptionPlanDTO toDTO(SubscriptionPlan plan) {
        if (plan == null) return null;
        SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setPrice(plan.getPrice());
        dto.setDurationDays(plan.getDurationDays());
        dto.setDescription(plan.getDescription());
        return dto;
    }
}
