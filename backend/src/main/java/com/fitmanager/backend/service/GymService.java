package com.fitmanager.backend.service;

import com.fitmanager.backend.model.Gym;
import com.fitmanager.backend.repository.GymRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GymService {

    @Autowired
    private GymRepository gymRepository;

    // Guardar un gimnasio
    public Gym saveGym(Gym gym) {
        // Aquí podrías poner lógica: ej. "validar que el nombre no sea corto"
        return gymRepository.save(gym);
    }

    // Traer todos los gimnasios
    public List<Gym> getAllGyms() {
        return gymRepository.findAll();
    }

    // Buscar por ID
    public Gym getGymById(Long id) {
        return gymRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Gimnasio no encontrado con ID: " + id));
    }
}