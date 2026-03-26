package com.fitmanager.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationRequestDTO {

    // Datos del Usuario/Dueño
    @Email(message = "Email no válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @NotBlank(message = "El nombre es obligatorio")
    private String firstName;

    @NotBlank(message = "El apellido es obligatorio")
    private String lastName;

    // Datos del Gimnasio
    @NotBlank(message = "El nombre del gimnasio es obligatorio")
    private String gymName;

    @NotBlank(message = "La dirección del gimnasio es obligatoria")
    private String gymAddress;
}
