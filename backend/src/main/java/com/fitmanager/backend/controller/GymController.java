package com.fitmanager.backend.controller;

import com.fitmanager.backend.model.Gym;
import com.fitmanager.backend.service.GymService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gyms")
@CrossOrigin(origins = "http://localhost:5173")
public class GymController {

    @Autowired
    private GymService gymService;

    @GetMapping
    public List<Gym> listar() {
        return gymService.getAllGyms();
    }

    @PostMapping
    public Gym crear(@RequestBody Gym gym) {
        return gymService.saveGym(gym);
    }
}