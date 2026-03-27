package com.fitmanager.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationDays;
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "gym_id")
    private Gym gym;
}
