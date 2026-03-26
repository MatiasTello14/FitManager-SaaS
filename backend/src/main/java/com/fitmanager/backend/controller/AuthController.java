package com.fitmanager.backend.controller;

import com.fitmanager.backend.dto.AuthRequest;
import com.fitmanager.backend.dto.AuthResponse;
import com.fitmanager.backend.dto.RegistrationRequestDTO;
import com.fitmanager.backend.dto.UserDTO; // Importamos UserDTO
import com.fitmanager.backend.mapper.UserMapper; // Importamos UserMapper
import com.fitmanager.backend.model.User;
import com.fitmanager.backend.repository.UserRepository;
import com.fitmanager.backend.service.JwtService;
import com.fitmanager.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserMapper userMapper; // Inyectamos el Mapper

    @PostMapping("/register-gym")
    public ResponseEntity<UserDTO> registerOwner(@Valid @RequestBody RegistrationRequestDTO registrationDto) {
        try {
            User newUser = userService.registerGymOwner(registrationDto);
            // ✅ Devolvemos UserDTO en lugar de la entidad User
            return ResponseEntity.ok(userMapper.toDTO(newUser));
        } catch (Exception e) {
            // Cambiamos el tipo de retorno en el error para que sea consistente
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            String token = jwtService.generateToken(user.getEmail());

            AuthResponse response = new AuthResponse(
                    token,
                    user.getGym().getId(),
                    user.getEmail(),
                    user.getRole().name()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }
}