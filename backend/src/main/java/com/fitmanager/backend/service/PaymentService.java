package com.fitmanager.backend.service;

import com.fitmanager.backend.model.Member;
import com.fitmanager.backend.model.Payment;
import com.fitmanager.backend.model.SubscriptionPlan;
import com.fitmanager.backend.repository.MemberRepository;
import com.fitmanager.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importante para pagos

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Transactional
    public Payment registerPayment(Long memberId, String method, String dateStr) { // Agregamos dateStr
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        SubscriptionPlan plan = member.getSubscriptionPlan();
        if (plan == null) {
            throw new RuntimeException("El socio no tiene un plan asignado.");
        }

        Payment payment = new Payment();
        payment.setMember(member);
        payment.setPlan(plan);
        payment.setAmount(plan.getPrice());
        payment.setPaymentMethod(method);


        if (dateStr != null && !dateStr.isEmpty()) {
            // Convierte "2026-02-20" en una fecha que Java entiende
            payment.setPaymentDate(java.time.LocalDate.parse(dateStr).atStartOfDay());

            // También actualizamos la fecha en el Socio para que el Dashboard se entere
            member.setLastPaymentDate(java.time.LocalDate.parse(dateStr));
        } else {
            payment.setPaymentDate(LocalDateTime.now());
            member.setLastPaymentDate(java.time.LocalDate.now());
        }

        memberRepository.save(member); // Guardamos el cambio en el socio
        return paymentRepository.save(payment);
    }

    public List<Payment> getMemberHistory(Long memberId) {
        // Validamos que el socio exista antes de buscar el historial
        if (!memberRepository.existsById(memberId)) {
            throw new RuntimeException("No se puede obtener el historial: Socio inexistente.");
        }
        return paymentRepository.findByMemberIdOrderByPaymentDateDesc(memberId);
    }
}