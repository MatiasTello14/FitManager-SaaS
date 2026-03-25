package com.fitmanager.backend.controller;

import com.fitmanager.backend.model.SubscriptionPlan;
import com.fitmanager.backend.service.SubscriptionPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:5173")
public class SubscriptionPlanController {

    @Autowired
    private SubscriptionPlanService planService;

    @PostMapping
    public SubscriptionPlan create(@RequestBody SubscriptionPlan plan, @RequestParam Long gymId) {
        return planService.savePlan(plan, gymId);
    }

    @GetMapping("/gym/{gymId}")
    public List<SubscriptionPlan> listByGym(@PathVariable Long gymId) {
        return planService.getPlansByGym(gymId);
    }
}