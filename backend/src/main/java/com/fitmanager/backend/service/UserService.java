package com.fitmanager.backend.service;

import com.fitmanager.backend.model.Gym;
import com.fitmanager.backend.model.User;
import com.fitmanager.backend.repository.GymRepository;
import com.fitmanager.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el encriptador

    public User createUser(User user, Long gymId) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));

        // ENCRIPTAMOS la contraseña antes de guardar
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        user.setGym(gym);
        return userRepository.save(user);
    }
}