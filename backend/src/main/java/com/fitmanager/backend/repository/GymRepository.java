package com.fitmanager.backend.repository;

import com.fitmanager.backend.model.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long> {
    // Aquí se podría agregar métodos personalizados, por ejemplo:
    // Optional<Gym> findByName(String name);
}
