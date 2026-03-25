package com.fitmanager.backend.controller;

import com.fitmanager.backend.model.User;
import com.fitmanager.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // Usamos un RequestParam para pasar el gymId en la URL: /api/users?gymId=1
    @PostMapping
    public User save(@RequestBody User user, @RequestParam Long gymId) {
        return userService.createUser(user, gymId);
    }
}