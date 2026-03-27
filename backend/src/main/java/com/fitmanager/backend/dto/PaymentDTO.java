package com.fitmanager.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;

    private Long memberId;
    private String memberFullName;

    private String planName;
}