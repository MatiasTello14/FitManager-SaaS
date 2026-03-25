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

    private String name;        // Ej: "Pase Libre", "Crossfit 3 veces", etc.
    private String description;
    private BigDecimal price;   // Siempre usar BigDecimal para dinero
    private Integer durationDays; // Ej: 30 para un mes

    @ManyToOne
    @JoinColumn(name = "gym_id")
    private Gym gym; // A qué gimnasio pertenece este plan
}
