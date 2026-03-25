package com.fitmanager.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gyms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    private String address;

    @Column(unique = true)
    private String nit; // Identificador fiscal (opcional)

    private boolean active = true;
}
