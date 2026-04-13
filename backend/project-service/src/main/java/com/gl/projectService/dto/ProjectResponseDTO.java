package com.gl.projectService.dto;

import com.gl.projectService.entity.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectResponseDTO {
    private Long id;
    private Long founderId;
    private String title;
    private String description;
    private String technologyStack;
    private PostType postType;
    private int totalOpenings;
    private int filledOpenings;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
