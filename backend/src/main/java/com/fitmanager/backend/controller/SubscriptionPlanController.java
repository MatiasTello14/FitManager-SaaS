package com.fitmanager.backend.controller;

import com.fitmanager.backend.dto.SubscriptionPlanDTO;
import com.fitmanager.backend.mapper.SubscriptionPlanMapper;
import com.fitmanager.backend.model.SubscriptionPlan;
import com.fitmanager.backend.service.SubscriptionPlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/plans")

public class SubscriptionPlanController {

    @Autowired
    private SubscriptionPlanService planService;

    @Autowired
    private SubscriptionPlanMapper planMapper;

    @PostMapping
    public ResponseEntity<SubscriptionPlanDTO> create(
            @Valid @RequestBody SubscriptionPlanDTO planDto,
            @RequestParam Long gymId) {

        SubscriptionPlan savedPlan = planService.savePlan(planDto, gymId);
        return ResponseEntity.ok(planMapper.toDTO(savedPlan));
    }

    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<SubscriptionPlanDTO>> listByGym(@PathVariable Long gymId) {
        List<SubscriptionPlan> plans = planService.getPlansByGym(gymId);
        List<SubscriptionPlanDTO> dtos = plans.stream()
                .map(planMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build(); // Retorna un 204 No Content
    }
}