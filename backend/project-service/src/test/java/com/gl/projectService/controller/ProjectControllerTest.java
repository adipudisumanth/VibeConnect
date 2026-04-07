package com.gl.projectService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gl.projectService.dto.ProjectRequestDTO;
import com.gl.projectService.dto.StoryRequestDTO;
import com.gl.projectService.dto.ProjectResponseDTO;
import com.gl.projectService.exception.GlobalExceptionHandler;
import com.gl.projectService.exception.ProjectNotFoundException;
import com.gl.projectService.entity.PostType;
import com.gl.projectService.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectServiceController.class)
@Import(GlobalExceptionHandler.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private ProjectResponseDTO mockProjectResponse;
    private ProjectResponseDTO mockStoryResponse;

    @BeforeEach
    void setUp() {
        mockProjectResponse = ProjectResponseDTO.builder()
                .id(1L)
                .founderId(1L)
                .title("AI Startup Platform")
                .description("Building an AI powered hiring platform")
                .technologyStack("React, Spring Boot")
                .postType(PostType.PROJECT)
                .totalOpenings(3)
                .filledOpenings(0)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mockStoryResponse = ProjectResponseDTO.builder()
                .id(2L)
                .founderId(1L)
                .title("My Startup Journey Week 1")
                .description("We just launched our MVP!")
                .postType(PostType.STORY)
                .totalOpenings(0)
                .filledOpenings(0)
                .isActive(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void shouldCreateProjectAndReturn201() throws Exception {
        // Given
        ProjectRequestDTO request = new ProjectRequestDTO();
        request.setTitle("AI Startup Platform");
        request.setDescription("Building an AI powered hiring platform");
        request.setTechnologyStack("React, Spring Boot");
        request.setTotalOpenings(3);

        when(projectService.createProject(eq(1L), any(ProjectRequestDTO.class)))
                .thenReturn(mockProjectResponse);

        // When & Then
        mockMvc.perform(post("/api/projects")
                        .header("X-User-Id", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("AI Startup Platform"))
                .andExpect(jsonPath("$.postType").value("PROJECT"))
                .andExpect(jsonPath("$.totalOpenings").value(3));
    }

    @Test
    void shouldReturn400WhenProjectDescriptionIsBlank() throws Exception {
        // Given — blank description
        ProjectRequestDTO request = new ProjectRequestDTO();
        request.setTitle("AI Startup Platform");
        request.setDescription("");  // blank
        request.setTotalOpenings(3);

        // When & Then
        mockMvc.perform(post("/api/projects")
                        .header("X-User-Id", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.description").value("Description cannot be blank"));
    }

    @Test
    void shouldCreateStoryAndReturn201() throws Exception {
        // Given
        StoryRequestDTO request = new StoryRequestDTO();
        request.setTitle("My Startup Journey Week 1");
        request.setDescription("We just launched our MVP!");

        when(projectService.createStory(eq(1L), any(StoryRequestDTO.class)))
                .thenReturn(mockStoryResponse);

        // When & Then
        mockMvc.perform(post("/api/projects/stories")
                        .header("X-User-Id", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("My Startup Journey Week 1"))
                .andExpect(jsonPath("$.postType").value("STORY"))
                .andExpect(jsonPath("$.totalOpenings").value(0));
    }
    @Test
    void shouldReturn400WhenStoryTitleIsBlank() throws Exception {
        // Given — blank title
        StoryRequestDTO request = new StoryRequestDTO();
        request.setTitle("");   // blank
        request.setDescription("We just launched our MVP!");

        // When & Then
        mockMvc.perform(post("/api/projects/stories")
                        .header("X-User-Id", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Title cannot be blank"));
    }
    @Test
    void shouldReturnStoryFeedWith200() throws Exception {
        // Given
        when(projectService.getStoryFeed()).thenReturn(List.of(mockStoryResponse));

        // When & Then
        mockMvc.perform(get("/api/projects/feed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].postType").value("STORY"))
                .andExpect(jsonPath("$[0].title").value("My Startup Journey Week 1"));
    }
    @Test
    void shouldReturnEmptyListWhenNoStoriesExist() throws Exception {
        // Given
        when(projectService.getStoryFeed()).thenReturn(List.of());

        // When & Then
        mockMvc.perform(get("/api/projects/feed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
    @Test
    void shouldReturnProjectOpeningsWith200() throws Exception {
        // Given
        when(projectService.getProjectOpenings()).thenReturn(List.of(mockProjectResponse));

        // When & Then
        mockMvc.perform(get("/api/projects/openings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].postType").value("PROJECT"))
                .andExpect(jsonPath("$[0].active").value(true));
    }
    @Test
    void shouldReturnEmptyListWhenNoOpeningsExist() throws Exception {
        // Given
        when(projectService.getProjectOpenings()).thenReturn(List.of());

        // When & Then
        mockMvc.perform(get("/api/projects/openings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
    @Test
    void shouldReturnProjectWhenValidIdProvided() throws Exception {
        // Given
        when(projectService.getProjectById(1L)).thenReturn(mockProjectResponse);

        // When & Then
        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("AI Startup Platform"));
    }
    @Test
    void shouldReturn404WhenInvalidIdProvided() throws Exception {
        // Given
        when(projectService.getProjectById(999L))
                .thenThrow(new ProjectNotFoundException("Project not found with id: 999"));

        // When & Then
        mockMvc.perform(get("/api/projects/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Project not found with id: 999"));
    }
    @Test
    void shouldDeleteProjectAndReturn200() throws Exception {
        // Given
        doNothing().when(projectService).deleteProject(1L, 1L);

        // When & Then
        mockMvc.perform(delete("/api/projects/1")
                        .header("X-User-Id", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Project deleted successfully"));
    }
    @Test
    void shouldReturn403WhenNonOwnerTriesToDelete() throws Exception {
        // Given
        doThrow(new SecurityException("You are not authorized to delete this project"))
                .when(projectService).deleteProject(1L, 99L);

        // When & Then
        mockMvc.perform(delete("/api/projects/1")
                        .header("X-User-Id", "99"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error")
                        .value("You are not authorized to delete this project"));
    }
}
