package com.fitmanager.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String dni;

    private String email;
    private LocalDate registrationDate;
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "gym_id")
    @JsonIgnoreProperties({"members"})
    private Gym gym; // El socio pertenece a un gimnasio

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan subscriptionPlan; // El socio tiene un plan contratado
}
