package com.fitmanager.backend.controller;

import com.fitmanager.backend.dto.MemberDTO;
import com.fitmanager.backend.mapper.MemberMapper;
import com.fitmanager.backend.model.Member;
import com.fitmanager.backend.service.MemberService;
import jakarta.validation.Valid; // Importante
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberMapper memberMapper;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody MemberDTO memberDto,
                                    @RequestParam Long gymId,
                                    @RequestParam Long planId) {
        try {

            Member newMember = memberService.createMember(memberDto, gymId, planId);
            return ResponseEntity.ok(memberMapper.toDTO(newMember));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/gym/{gymId}")
    public List<MemberDTO> list(@PathVariable Long gymId) {
        List<Member> members = memberService.getAllByGym(gymId);
        return members.stream()
                .map(memberMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MemberDTO> updateStatus(@PathVariable Long id) {
        Member updated = memberService.toggleStatus(id);
        return ResponseEntity.ok(memberMapper.toDTO(updated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberDTO memberDto,
            @RequestParam(required = false) Long planId) {

        Member updatedMember = memberService.updateMember(id, memberDto, planId);
        return ResponseEntity.ok(memberMapper.toDTO(updatedMember));
    }
}