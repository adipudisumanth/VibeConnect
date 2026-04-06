package com.gl.projectService.dto;


import com.gl.projectService.entity.PostType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequestDTO {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    private String technologyStack;

    @NotNull(message = "Total openings is required")
    @Min(value = 1, message = "Must have at least 1 opening")
    private Integer totalOpenings;


}
