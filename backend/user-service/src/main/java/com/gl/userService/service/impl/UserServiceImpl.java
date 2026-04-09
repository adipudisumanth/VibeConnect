package com.gl.userService.service.impl;

import com.gl.userService.entity.User;
import com.gl.userService.entity.UserRole;
import com.gl.userService.exception.InvalidOtpException;
import com.gl.userService.repository.UserRepository;
import com.gl.userService.service.UserService;
import com.gl.userService.dto.*;
import com.gl.userService.util.JwtUtils;
import com.gl.userService.exception.UserAlreadyExistsException;
import com.gl.userService.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.HashMap;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, String> otpStorage = new HashMap<>();

    @Override
    @Transactional
    public AuthResponse register(UserRegistrationDTO dto) {
        log.info("Processing registration for email: {}", dto.getEmail());

        if (userRepository.existsByEmail(dto.getEmail())) {
            log.error("Registration failed: Email {} already exists", dto.getEmail());
            throw new UserAlreadyExistsException("Email already in use: " + dto.getEmail());
        }

        User user = User.builder()
                .email(dto.getEmail())
                .role(dto.getRole())
                .fullName(dto.getFullName())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .skillsAndVibes(dto.getSkillsAndVibes())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        String token = jwtUtils.generateToken(savedUser.getId(), savedUser.getRole().name());
        return new AuthResponse(token, mapToDto(savedUser));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest dto) {
        log.info("Authentication attempt for email: {}", dto.getEmail());

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Invalid Credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new UserNotFoundException("Invalid Credentials");
        }

        String token = jwtUtils.generateToken(user.getId(), user.getRole().name());
        return new AuthResponse(token, mapToDto(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getProfile(Long id) {
        log.debug("Fetching profile for ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
        return mapToDto(user);
    }

    @Override
    @Transactional
    public UserResponseDTO updateProfile(Long id, UserRegistrationDTO dto) {
        log.info("Updating profile for User ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

        user.setFullName(dto.getFullName());
        user.setSkillsAndVibes(dto.getSkillsAndVibes());

        User updatedUser = userRepository.save(user);
        log.info("Profile updated successfully for User ID: {}", id);
        return mapToDto(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getUsersByRole(String role) {
        try {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            return userRepository.findByRole(userRole).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            log.error("Invalid role provided: {}", role);
            throw new RuntimeException("Invalid Role: " + role);
        }
    }

    @Override
    @Transactional
    public void generateAndSendOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new UserNotFoundException("User not found");
        }
        
        String otp = String.valueOf(new SecureRandom().nextInt(900000) + 100000);
        otpStorage.put(email, otp);
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP is: " + otp);
        mailSender.send(message);
        
        log.info("OTP sent to: {}", email);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new InvalidOtpException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpStorage.remove(email);
        
        log.info("Password successfully reset for: {}", email);
    }

    private UserResponseDTO mapToDto(User user) {
        return new UserResponseDTO(
            user.getId(), 
            user.getEmail(), 
            user.getFullName(), 
            user.getRole(),
            user.getSkillsAndVibes()
        );
    }
}