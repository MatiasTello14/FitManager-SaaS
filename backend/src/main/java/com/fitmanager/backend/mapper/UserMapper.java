package com.fitmanager.backend.mapper;

import com.fitmanager.backend.dto.UserDTO;
import com.fitmanager.backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole().name());
        if (user.getGym() != null) {
            dto.setGymId(user.getGym().getId());
        }
        return dto;
    }
}
