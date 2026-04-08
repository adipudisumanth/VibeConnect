package com.gl.userService.controller;

import com.gl.userService.dto.*;
import com.gl.userService.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegistrationDTO dto) {
        log.info("Received registration request for email: {}", dto.getEmail());
        return new ResponseEntity<>(userService.register(dto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest dto) {
        log.info("Received login request for email: {}", dto.getEmail());
        return ResponseEntity.ok(userService.login(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getProfile(@PathVariable Long id) {
        log.info("Fetching profile for user ID: {}", id);
        return ResponseEntity.ok(userService.getProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateProfile(@PathVariable Long id, @Valid @RequestBody UserRegistrationDTO dto) {
        log.info("Updating profile for user ID: {}", id);
        return ResponseEntity.ok(userService.updateProfile(id, dto));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponseDTO>> getUsersByRole(@PathVariable String role) {
        log.info("Fetching all users with role: {}", role);
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        log.info("Received forgot password request for email: {}", request.email());
        userService.generateAndSendOtp(request.email());
        return ResponseEntity.ok("OTP sent successfully to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Received password reset attempt for email: {}", request.email());
        userService.resetPassword(request.email(), request.otp(), request.newPassword());
        return ResponseEntity.ok("Password has been reset successfully.");
    }
}