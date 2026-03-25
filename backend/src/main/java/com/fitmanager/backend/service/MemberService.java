package com.fitmanager.backend.service;

import com.fitmanager.backend.model.Gym;
import com.fitmanager.backend.model.Member;
import com.fitmanager.backend.model.Payment;
import com.fitmanager.backend.model.SubscriptionPlan;
import com.fitmanager.backend.repository.GymRepository;
import com.fitmanager.backend.repository.MemberRepository;
import com.fitmanager.backend.repository.PaymentRepository;
import com.fitmanager.backend.repository.SubscriptionPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private SubscriptionPlanRepository planRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public boolean canAccess(String dni) {
        // Buscamos al socio directamente
        Member member = memberRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado con DNI: " + dni));

        List<Payment> payments = paymentRepository.findByMemberIdOrderByPaymentDateDesc(member.getId());

        if (payments.isEmpty()) return false; // Nunca pagó

        Payment lastPayment = payments.get(0);

        // Verificamos si el pago sigue vigente
        return lastPayment.getPaymentDate().isAfter(LocalDateTime.now().minusDays(30));
    }

    public Member createMember(Member member, Long gymId, Long planId) {
        // 1. Validación rápida
        if (memberRepository.existsByDni(member.getDni())) {
            throw new RuntimeException("El DNI " + member.getDni() + " ya pertenece a un socio registrado.");
        }

        // 2. Si no existe, seguimos con la lógica normal
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        member.setGym(gym);
        member.setSubscriptionPlan(plan);
        member.setActive(true);
        member.setRegistrationDate(LocalDate.now());

        return memberRepository.save(member);
    }

    public List<Member> getAllByGym(Long gymId) {
        return memberRepository.findByGymId(gymId);
    }

    public Member toggleStatus(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        // Si estaba activo lo desactiva, y viceversa
        member.setActive(!member.isActive());
        return memberRepository.save(member);
    }

    public Member updateMember(Long id, Member details, Long planId) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        // Actualizamos datos básicos
        member.setFirstName(details.getFirstName());
        member.setLastName(details.getLastName());
        member.setDni(details.getDni());
        member.setEmail(details.getEmail());

        // Si viene un planId nuevo, lo actualizamos
        if (planId != null) {
            SubscriptionPlan newPlan = planRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
            member.setSubscriptionPlan(newPlan);
        }

        return memberRepository.save(member);
    }
}
