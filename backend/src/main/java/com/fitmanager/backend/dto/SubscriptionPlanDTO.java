package com.fitmanager.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SubscriptionPlanDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer durationDays;
    private String description;
}
