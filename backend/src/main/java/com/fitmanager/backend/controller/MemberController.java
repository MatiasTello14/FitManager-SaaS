package com.fitmanager.backend.controller;

import com.fitmanager.backend.model.Member;
import com.fitmanager.backend.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Member member,
                                    @RequestParam Long gymId,
                                    @RequestParam Long planId) {
        try {
            Member newMember = memberService.createMember(member, gymId, planId);
            return ResponseEntity.ok(newMember);
        } catch (RuntimeException e) {
            // Devolvemos el mensaje de la excepción para que React lo muestre en el alert
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/gym/{gymId}")
    public List<Member> list(@PathVariable Long gymId) {
        return memberService.getAllByGym(gymId);
    }

    @PutMapping("/{id}/status")
    @CrossOrigin(origins = "http://localhost:5173")
    public Member updateStatus(@PathVariable Long id) {
        return memberService.toggleStatus(id);
    }

    @PutMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:5173")
    public Member updateMember(
            @PathVariable Long id,
            @RequestBody Member memberDetails,
            @RequestParam(required = false) Long planId) { // Agregamos el planId opcional
        return memberService.updateMember(id, memberDetails, planId);
    }
}