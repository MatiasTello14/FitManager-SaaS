package com.fitmanager.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MemberDTO {
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String firstName;

    @NotBlank(message = "El apellido es obligatorio")
    private String lastName;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(min = 7, max = 10, message = "El DNI debe tener entre 7 y 10 caracteres")
    private String dni;

    @Email(message = "El formato del email no es válido")
    private String email;

    private LocalDate registrationDate;
    private boolean active;
    private Long planId;
    private String planName;
    private LocalDate lastPaymentDate;
    private BigDecimal planPrice;
}