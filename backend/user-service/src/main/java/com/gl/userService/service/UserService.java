package com.gl.userService.service;

import com.gl.userService.dto.*;
import java.util.List;

public interface UserService {
    AuthResponse register(UserRegistrationDTO dto);
    AuthResponse login(LoginRequest dto);
    UserResponseDTO getProfile(Long id);
    UserResponseDTO updateProfile(Long id, UserRegistrationDTO dto);
    List<UserResponseDTO> getUsersByRole(String role);
    void generateAndSendOtp(String email);
    void resetPassword(String email, String otp, String newPassword);
}