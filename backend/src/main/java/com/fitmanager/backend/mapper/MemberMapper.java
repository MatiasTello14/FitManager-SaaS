package com.fitmanager.backend.mapper;

import com.fitmanager.backend.dto.MemberDTO;
import com.fitmanager.backend.model.Member;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {

    public MemberDTO toDTO(Member member) {
        if (member == null) return null;

        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setDni(member.getDni());
        dto.setEmail(member.getEmail());
        dto.setRegistrationDate(member.getRegistrationDate());
        dto.setActive(member.isActive());
        dto.setLastPaymentDate(member.getLastPaymentDate());

        if (member.getSubscriptionPlan() != null) {
            dto.setPlanId(member.getSubscriptionPlan().getId());
            dto.setPlanName(member.getSubscriptionPlan().getName());
            dto.setPlanPrice(member.getSubscriptionPlan().getPrice());
        }

        return dto;
    }


    public Member toEntity(MemberDTO dto) {
        if (dto == null) return null;
        Member member = new Member();
        member.setId(dto.getId());
        member.setFirstName(dto.getFirstName());
        member.setLastName(dto.getLastName());
        member.setDni(dto.getDni());
        member.setEmail(dto.getEmail());
        member.setRegistrationDate(dto.getRegistrationDate());
        member.setActive(dto.isActive());
        return member;
    }
}
