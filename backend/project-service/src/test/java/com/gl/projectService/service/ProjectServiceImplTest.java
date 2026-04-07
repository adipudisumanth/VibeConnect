package com.gl.projectService.service;

import com.gl.projectService.dto.ProjectRequestDTO;
import com.gl.projectService.dto.StoryRequestDTO;
import com.gl.projectService.dto.ProjectResponseDTO;
import com.gl.projectService.exception.ProjectNotFoundException;
import com.gl.projectService.entity.PostType;
import com.gl.projectService.entity.Project;
import com.gl.projectService.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project mockProject;
    private Project mockStory;

    @BeforeEach
    void setUp() {
        mockProject = Project.builder()
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

        mockStory = Project.builder()
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
    void shouldCreateProjectSuccessfully() {
        // Given
        ProjectRequestDTO request = new ProjectRequestDTO();
        request.setTitle("AI Startup Platform");
        request.setDescription("Building an AI powered hiring platform");
        request.setTechnologyStack("React, Spring Boot");
        request.setTotalOpenings(3);

        when(projectRepository.save(any(Project.class))).thenReturn(mockProject);

        // When
        ProjectResponseDTO response = projectService.createProject(1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("AI Startup Platform");
        assertThat(response.getPostType()).isEqualTo(PostType.PROJECT);
        assertThat(response.getTotalOpenings()).isEqualTo(3);
        verify(projectRepository, times(1)).save(any(Project.class));
    }
    @Test
    void shouldCreateStorySuccessfully() {
        // Given
        StoryRequestDTO request = new StoryRequestDTO();
        request.setTitle("My Startup Journey Week 1");
        request.setDescription("We just launched our MVP!");

        when(projectRepository.save(any(Project.class))).thenReturn(mockStory);

        // When
        ProjectResponseDTO response = projectService.createStory(1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("My Startup Journey Week 1");
        assertThat(response.getPostType()).isEqualTo(PostType.STORY);
        assertThat(response.getTotalOpenings()).isEqualTo(0);
        assertThat(response.isActive()).isFalse();
        verify(projectRepository, times(1)).save(any(Project.class));
    }
    @Test
    void shouldReturnProjectWhenValidIdProvided() throws ProjectNotFoundException {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(mockProject));

        // When
        ProjectResponseDTO response = projectService.getProjectById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("AI Startup Platform");
        verify(projectRepository, times(1)).findById(1L);
    }
    @Test
    void shouldThrowProjectNotFoundExceptionWhenInvalidIdProvided() {
        // Given
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ProjectNotFoundException.class, () -> {
            projectService.getProjectById(999L);
        });

        verify(projectRepository, times(1)).findById(999L);
    }
    @Test
    void shouldDeleteProjectWhenOwnerRequests() throws ProjectNotFoundException {
        // Given
        when(projectRepository.findById(1L)).thenReturn(Optional.of(mockProject));
        doNothing().when(projectRepository).deleteById(1L);

        // When
        projectService.deleteProject(1L, 1L);

        // Then
        verify(projectRepository, times(1)).findById(1L);
        verify(projectRepository, times(1)).deleteById(1L);
    }
    @Test
    void shouldThrowSecurityExceptionWhenNonOwnerTriesToDelete() {
        // Given — project belongs to founder 1, but founder 99 is requesting
        when(projectRepository.findById(1L)).thenReturn(Optional.of(mockProject));

        // When & Then
        assertThrows(SecurityException.class, () -> {
            projectService.deleteProject(1L, 99L);
        });

        verify(projectRepository, times(1)).findById(1L);
        verify(projectRepository, never()).deleteById(any());
    }
    @Test
    void shouldReturnStoryFeed() {
        // Given
        when(projectRepository.findByPostTypeOrderByCreatedAtDesc(
                eq(PostType.STORY), any(PageRequest.class)))
                .thenReturn(List.of(mockStory));

        // When
        List<ProjectResponseDTO> feed = projectService.getStoryFeed();

        // Then
        assertThat(feed).isNotNull();
        assertThat(feed).hasSize(1);
        assertThat(feed.get(0).getPostType()).isEqualTo(PostType.STORY);
        verify(projectRepository, times(1))
                .findByPostTypeOrderByCreatedAtDesc(eq(PostType.STORY), any(PageRequest.class));
    }
    @Test
    void shouldReturnProjectOpenings() {
        // Given
        when(projectRepository.findByPostTypeAndIsActiveTrueOrderByCreatedAtDesc(
                eq(PostType.PROJECT), any(PageRequest.class)))
                .thenReturn(List.of(mockProject));

        // When
        List<ProjectResponseDTO> openings = projectService.getProjectOpenings();

        // Then
        assertThat(openings).isNotNull();
        assertThat(openings).hasSize(1);
        assertThat(openings.get(0).getPostType()).isEqualTo(PostType.PROJECT);
        assertThat(openings.get(0).isActive()).isTrue();
        verify(projectRepository, times(1))
                .findByPostTypeAndIsActiveTrueOrderByCreatedAtDesc(
                        eq(PostType.PROJECT), any(PageRequest.class));
    }
}


