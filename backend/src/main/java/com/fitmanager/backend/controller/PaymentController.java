package com.fitmanager.backend.controller;

import com.fitmanager.backend.model.Payment;
import com.fitmanager.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/member/{memberId}")
    public Payment pay(@PathVariable Long memberId, @RequestParam String method) {
        return paymentService.registerPayment(memberId, method);
    }

    @GetMapping("/member/{memberId}")
    public List<Payment> getHistory(@PathVariable Long memberId) {
        return paymentService.getMemberHistory(memberId);
    }
}