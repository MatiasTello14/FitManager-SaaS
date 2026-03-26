package com.fitmanager.backend.service;

import com.fitmanager.backend.dto.RegistrationRequestDTO;
import com.fitmanager.backend.dto.UserDTO;
import com.fitmanager.backend.mapper.UserMapper;
import com.fitmanager.backend.model.*;
import com.fitmanager.backend.repository.GymRepository;
import com.fitmanager.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GymRepository gymRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapper userMapper;

    // Para obtener la lista de empleados
    public List<User> getUsersByGym(Long gymId) {
        return userRepository.findByGymId(gymId);
    }

    // Para crear un nuevo empleado (Coach/Admin secundario)
    public UserDTO createEmployee(UserDTO userDto) {
        Gym gym = gymRepository.findById(userDto.getGymId())
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));

        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        // Seteamos una password provisoria (podrías pedirla en el DTO también)
        user.setPassword(passwordEncoder.encode("gym123456"));
        user.setGym(gym);
        user.setRole(Role.valueOf(userDto.getRole()));

        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public User registerGymOwner(RegistrationRequestDTO registrationDto) {
        Gym newGym = new Gym();
        newGym.setName(registrationDto.getGymName());
        newGym.setAddress(registrationDto.getGymAddress());
        newGym = gymRepository.save(newGym);

        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setGym(newGym);
        user.setRole(Role.ADMIN);

        return userRepository.save(user);
    }
}