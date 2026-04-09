package com.gl.userService.controller;

import com.gl.userService.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gl.userService.dto.*;
import com.gl.userService.entity.UserRole;
import com.gl.userService.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({UserController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/users/register - Success")
    void testRegister_Success() throws Exception {
        UserRequestDTO request = UserRequestDTO.builder()
                .email("founder@vibe.com")
                .password("password123")
                .fullName("Startup Founder")
                .role("FOUNDER")
                .build();

        UserResponseDTO userDto = new UserResponseDTO(1L, "founder@vibe.com", "Startup Founder", UserRole.FOUNDER, null);
        AuthResponse response = new AuthResponse("mock-token", userDto);
        
        when(userService.register(any(UserRegistrationDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.user.id").value(1));
    }

    @Test
    @DisplayName("POST /api/users/forgot-password - Success")
    void testForgotPassword_Success() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("test@vibe.com");
        doNothing().when(userService).generateAndSendOtp(anyString());

        mockMvc.perform(post("/api/users/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent successfully to your email."));
    }

    @Test
    @DisplayName("POST /api/users/reset-password - Success")
    void testResetPassword_Success() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("test@vibe.com", "123456", "newPassword123");
        doNothing().when(userService).resetPassword(anyString(), anyString(), anyString());

        mockMvc.perform(post("/api/users/reset-password")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password has been reset successfully."));
    }

    @Test
    @DisplayName("POST /api/users/register - Validation Failure")
    void testRegister_ValidationError() throws Exception {
        UserRequestDTO invalidRequest = UserRequestDTO.builder()
                .email("not-an-email")
                .password("123")
                .build();

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}