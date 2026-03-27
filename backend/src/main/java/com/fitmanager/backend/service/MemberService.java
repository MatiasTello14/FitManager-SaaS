package com.fitmanager.backend.service;

import com.fitmanager.backend.dto.MemberDTO;
import com.fitmanager.backend.mapper.MemberMapper;
import com.fitmanager.backend.model.*;
import com.fitmanager.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
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
    @Autowired
    private MemberMapper memberMapper;

    public Member createMember(MemberDTO dto, Long gymId, Long planId) {
        // Convertimos DTO a Entidad
        Member member = memberMapper.toEntity(dto);

        if (memberRepository.existsByDni(member.getDni())) {
            throw new RuntimeException("El DNI " + member.getDni() + " ya pertenece a un socio registrado.");
        }

        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        member.setGym(gym);
        member.setSubscriptionPlan(plan);
        member.setActive(true);

        if (member.getRegistrationDate() == null) {
            member.setRegistrationDate(LocalDate.now());
        }

        return memberRepository.save(member);
    }

    public Member updateMember(Long id, MemberDTO detailsDto, Long planId) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        // Actualizamos desde el DTO
        member.setFirstName(detailsDto.getFirstName());
        member.setLastName(detailsDto.getLastName());
        member.setDni(detailsDto.getDni());
        member.setEmail(detailsDto.getEmail());

        if (detailsDto.getRegistrationDate() != null) {
            member.setRegistrationDate(detailsDto.getRegistrationDate());
        }

        if (planId != null) {
            SubscriptionPlan newPlan = planRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
            member.setSubscriptionPlan(newPlan);
        }

        return memberRepository.save(member);
    }

    public List<Member> getAllByGym(Long gymId) {
        // Esto trae los socios con la fecha que tengan guardada en su columna
        return memberRepository.findByGymId(gymId);
    }

    public Member toggleStatus(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        member.setActive(!member.isActive());
        return memberRepository.save(member);
    }
}