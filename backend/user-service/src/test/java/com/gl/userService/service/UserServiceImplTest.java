package com.gl.userService.service;

import com.gl.userService.dto.AuthResponse;
import com.gl.userService.dto.UserRegistrationDTO;
import com.gl.userService.dto.LoginRequest;
import com.gl.userService.entity.User;
import com.gl.userService.exception.UserAlreadyExistsException;
import com.gl.userService.exception.UserNotFoundException;
import com.gl.userService.repository.UserRepository;
import com.gl.userService.service.impl.UserServiceImpl;
import com.gl.userService.util.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private UserServiceImpl userService;

    private UserRegistrationDTO registrationDto;
    private User user;

    @BeforeEach
    void setUp() {
        registrationDto = UserRegistrationDTO.builder()
                .email("test@vibeconnect.com")
                .password("password123")
                .fullName("Vibe Coder")
                .role("VIBECODER")
                .build();

        user = User.builder()
                .id(1L)
                .email("test@vibeconnect.com")
                .role("VIBECODER")
                .build();
    }

    @Test
@DisplayName("US-003: Should Register User Successfully")
void testRegisterUser_Success() {
    when(userRepository.existsByEmail(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
    when(userRepository.save(any(User.class))).thenReturn(user);
    when(jwtUtils.generateToken(anyLong(), anyString())).thenReturn("mock-jwt-token");

    AuthResponse response = userService.register(registrationDto);

    assertNotNull(response);
    assertEquals("mock-jwt-token", response.getToken());
    assertEquals(1L, response.getUserId());
    verify(userRepository, times(1)).save(any(User.class));
}

    @Test
    @DisplayName("US-003: Should Throw UserAlreadyExistsException for Duplicate Email")
    void testRegisterUser_DuplicateEmail() {
        when(userRepository.existsByEmail(registrationDto.getEmail())).thenReturn(true);
        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class, () -> {
            userService.register(registrationDto);
        });
        assertEquals("Email already in use: test@vibeconnect.com", exception.getMessage());
    }

    @Test
    @DisplayName("Login: Should Return Token for Valid Credentials")
    void testLogin_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@vibeconnect.com");
        loginRequest.setPassword("password123");
        user.setPasswordHash("hashedPassword");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtils.generateToken(anyLong(), anyString())).thenReturn("mock-jwt-token");
        AuthResponse response = userService.login(loginRequest);
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
    }

    @Test
    @DisplayName("Profile: Should Throw UserNotFoundException when User Not Found")
    void testGetProfile_NotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());
        UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
            userService.getProfile(99L);
        });
        assertEquals("User not found with ID: 99", exception.getMessage());
    }
}