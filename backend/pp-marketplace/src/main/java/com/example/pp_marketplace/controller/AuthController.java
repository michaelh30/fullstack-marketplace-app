package com.example.pp_marketplace.controller;

import com.example.pp_marketplace.dto.LoginRequest;
import com.example.pp_marketplace.dto.LoginResponse;
import com.example.pp_marketplace.dto.RegisterRequest;
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
    public User signup(@RequestBody RegisterRequest request) {
        return authService.registerUser(request.getEmail(), request.getPassword(), request.getFullName());
    }

    @PostMapping("/admin/register")
    public User registerAdmin(@RequestBody RegisterRequest request) {
        return authService.registerAdmin(request.getEmail(), request.getPassword(), request.getFullName());
    }
}
