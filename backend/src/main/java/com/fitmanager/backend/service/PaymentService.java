package com.fitmanager.backend.service;

import com.fitmanager.backend.model.Member;
import com.fitmanager.backend.model.Payment;
import com.fitmanager.backend.repository.MemberRepository;
import com.fitmanager.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MemberRepository memberRepository;

    public Payment registerPayment(Long memberId, String method) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        Payment payment = new Payment();
        payment.setMember(member);
        payment.setPlan(member.getSubscriptionPlan()); // Toma el plan que tiene asignado
        payment.setAmount(member.getSubscriptionPlan().getPrice()); // Toma el precio del plan
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(method);

        return paymentRepository.save(payment);
    }

    public List<Payment> getMemberHistory(Long memberId) {
        return paymentRepository.findByMemberIdOrderByPaymentDateDesc(memberId);
    }
}
