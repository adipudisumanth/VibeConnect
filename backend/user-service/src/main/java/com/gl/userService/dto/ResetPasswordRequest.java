package com.gl.userService.dto;

public record ResetPasswordRequest(String email, String otp, String newPassword) {}