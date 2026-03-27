package com.fitmanager.backend.controller;

import com.fitmanager.backend.dto.PaymentDTO;
import com.fitmanager.backend.mapper.PaymentMapper;
import com.fitmanager.backend.model.Payment;
import com.fitmanager.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentMapper paymentMapper;

    @PostMapping("/member/{memberId}")
    public ResponseEntity<PaymentDTO> pay(
            @PathVariable Long memberId,
            @RequestParam String method,
            @RequestParam(required = false) String date
    ) {
        Payment newPayment = paymentService.registerPayment(memberId, method, date);
        return ResponseEntity.ok(paymentMapper.toDTO(newPayment));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<PaymentDTO>> getHistory(@PathVariable Long memberId) {
        List<Payment> history = paymentService.getMemberHistory(memberId);
        List<PaymentDTO> dtos = history.stream()
                .map(paymentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}