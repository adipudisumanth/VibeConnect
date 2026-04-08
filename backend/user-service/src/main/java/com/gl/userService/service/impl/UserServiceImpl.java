package com.gl.userService.service.impl;

import com.gl.userService.entity.User;
import com.gl.userService.repository.UserRepository;
import com.gl.userService.service.UserService;
import com.gl.userService.dto.*;
import com.gl.userService.util.JwtUtils;
import com.gl.userService.exception.UserAlreadyExistsException;
import com.gl.userService.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

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
                .fullName(dto.getFullName())
                .role(dto.getRole())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .skillsAndVibes(dto.getSkillsAndVibes())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        String token = jwtUtils.generateToken(savedUser.getId(), savedUser.getRole());
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

        String token = jwtUtils.generateToken(user.getId(), user.getRole());
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
        log.debug("Searching for users with role: {}", role);
        return userRepository.findByRole(role).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private UserResponseDTO mapToDto(User user) {
        return new UserResponseDTO(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getSkillsAndVibes());
    }
}