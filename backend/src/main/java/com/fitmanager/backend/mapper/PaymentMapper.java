package com.fitmanager.backend.mapper;

import com.fitmanager.backend.dto.PaymentDTO;
import com.fitmanager.backend.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {
    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) return null;

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod());

        if (payment.getMember() != null) {
            dto.setMemberId(payment.getMember().getId());
            dto.setMemberFullName(payment.getMember().getFirstName() + " " + payment.getMember().getLastName());
        }

        if (payment.getPlan() != null) {
            dto.setPlanName(payment.getPlan().getName());
        }

        return dto;
    }
}