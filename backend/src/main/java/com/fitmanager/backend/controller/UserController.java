package com.fitmanager.backend.controller;

import com.fitmanager.backend.dto.UserDTO;
import com.fitmanager.backend.mapper.UserMapper;
import com.fitmanager.backend.model.User;
import com.fitmanager.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    // --- CREAR EMPLEADO (Coach/Admin) ---
    @PostMapping
    public ResponseEntity<UserDTO> save(@Valid @RequestBody UserDTO userDto) {
        try {

            UserDTO savedUser = userService.createEmployee(userDto);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // --- LISTAR EMPLEADOS POR GIMNASIO ---
    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<UserDTO>> getGymEmployees(@PathVariable Long gymId) {
        List<User> employees = userService.getUsersByGym(gymId);


        List<UserDTO> dtos = employees.stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}