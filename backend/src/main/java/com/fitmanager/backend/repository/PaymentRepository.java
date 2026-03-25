package com.fitmanager.backend.repository;

import com.fitmanager.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Para ver el historial de un socio
    List<Payment> findByMemberIdOrderByPaymentDateDesc(Long memberId);
}