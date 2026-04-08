package com.gl.application_service.dto;

import com.gl.application_service.enums.Status;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {

    private Long applicationId;

    @NotNull(message = "Project ID cannot be null")
    @Positive(message = "Project ID must be a positive number")
    private Long projectId;

    @NotNull(message = "User ID cannot be null")
    @Positive(message = "User ID must be a positive number")
    private Long userId;

    private Status status;

    @PastOrPresent(message = "Applied time cannot be in the future")
    private LocalDateTime appliedAt;

    @PastOrPresent(message = "Updated time cannot be in the future")
    private LocalDateTime updatedAt;
}