package com.example.pp_marketplace.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.example.pp_marketplace.dto.LoginRequest;
import com.example.pp_marketplace.dto.LoginResponse;
import com.example.pp_marketplace.entity.User;
import com.example.pp_marketplace.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Date;
import javax.crypto.SecretKey;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!BCrypt.verifyer().verify(request.getPassword().toCharArray(), user.getPasswordHash()).verified) {
            throw new RuntimeException("Invalid password");
        }

        String token = generateToken(user);

        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .token(token)
                .build();
    }

    public User registerUser(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        String passwordHash = BCrypt.withDefaults().hashToString(12, password.toCharArray());

        User user = User.builder()
                .email(email)
                .passwordHash(passwordHash)
                .fullName(fullName)
                .role("CUSTOMER")
                .build();

        return userRepository.save(user);
    }

    public User registerAdmin(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        String passwordHash = BCrypt.withDefaults().hashToString(12, password.toCharArray());

        User user = User.builder()
                .email(email)
                .passwordHash(passwordHash)
                .fullName(fullName)
                .role("ADMIN")
                .build();

        return userRepository.save(user);
    }

    public String generateToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("fullName", user.getFullName())
                .claim("role", user.getRole())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Long.parseLong(Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
