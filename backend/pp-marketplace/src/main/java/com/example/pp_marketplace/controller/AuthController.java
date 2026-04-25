package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.LoginRequest;
import com.example.pp_marketplace.dto.LoginResponse;
import com.example.pp_marketplace.entity.User;
import com.example.pp_marketplace.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public User signup(@RequestParam String email, @RequestParam String password, @RequestParam String fullName) {
        return authService.registerUser(email, password, fullName);
    }

    @PostMapping("/admin/register")
    public User registerAdmin(@RequestParam String email, @RequestParam String password, @RequestParam String fullName) {
        return authService.registerAdmin(email, password, fullName);
    }
}
