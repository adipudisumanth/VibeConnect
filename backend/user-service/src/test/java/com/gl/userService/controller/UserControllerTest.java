package com.gl.userService.controller;

import com.gl.userService.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gl.userService.dto.AuthResponse;
import com.gl.userService.dto.UserRegistrationDTO;
import com.gl.userService.dto.UserRequestDTO;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({UserController.class, GlobalExceptionHandler.class}) // Critical: Include the Exception Handler
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean // Fixed: Replaced deprecated @MockBean
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

        AuthResponse response = new AuthResponse("mock-token", "founder@vibe.com", "FOUNDER");

        when(userService.register(any(UserRegistrationDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @DisplayName("POST /api/users/register - Validation Failure")
    void testRegister_ValidationError() throws Exception {
        // This triggers the @Email and @Size validations in UserRequestDTO
        UserRequestDTO invalidRequest = UserRequestDTO.builder()
                .email("not-an-email")
                .password("123")
                .build();

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest()); // Now correctly returns 400
    }
}