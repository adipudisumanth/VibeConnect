package com.gl.userService.service;

import com.gl.userService.dto.*;
import com.gl.userService.entity.User;
import com.gl.userService.entity.UserRole;
import com.gl.userService.exception.InvalidOtpException;
import com.gl.userService.repository.UserRepository;
import com.gl.userService.service.impl.UserServiceImpl;
import com.gl.userService.util.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;
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
    @Mock
    private JavaMailSender mailSender;

    @Spy
    private Map<String, String> otpStorage = new HashMap<>();

    @InjectMocks
    private UserServiceImpl userService;

    private UserRegistrationDTO registrationDto;
    private User user;

    @BeforeEach
    void setUp() {
        otpStorage.clear();
        ReflectionTestUtils.setField(userService, "otpStorage", otpStorage);

        registrationDto = UserRegistrationDTO.builder()
                .email("test@vibeconnect.com")
                .password("password123")
                .fullName("Vibe Coder")
                .role(UserRole.VIBECODER)
                .build();

        user = User.builder()
                .id(1L)
                .email("test@vibeconnect.com")
                .role(UserRole.VIBECODER)
                .fullName("Vibe Coder")
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
        assertNotNull(response.getUser());
        assertEquals(1L, response.getUser().getId());
    }

    @Test
    @DisplayName("OTP: Should generate and send email")
    void testGenerateOtp_Success() {
        String email = "test@vibe.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);

        userService.generateAndSendOtp(email);

        String storedOtp = otpStorage.get(email);

        assertNotNull(storedOtp);
        assertEquals(6, storedOtp.length());
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Reset: Should update password when OTP is valid")
    void testResetPassword_Success() {
        String email = "test@vibe.com";
        String otp = "123456";
        otpStorage.put(email, otp);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNewPass");

        userService.resetPassword(email, otp, "newPass");

        assertEquals("encodedNewPass", user.getPasswordHash());
        verify(userRepository).save(user);
        assertFalse(otpStorage.containsKey(email));
    }

    @Test
    @DisplayName("Reset: Should throw exception for invalid OTP")
    void testResetPassword_InvalidOtp() {
        String email = "test@vibe.com";
        otpStorage.put(email, "111111");

        assertThrows(InvalidOtpException.class, () ->
                userService.resetPassword(email, "999999", "newPass")
        );
    }

    @Test
    @DisplayName("Login: Should Return Token and User Details")
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
        assertNotNull(response.getUser());
        assertEquals(1L, response.getUser().getId());
    }
}