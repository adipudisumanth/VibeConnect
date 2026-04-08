package com.gl.projectService.service;


import com.gl.projectService.dto.ProjectRequestDTO;
import com.gl.projectService.dto.ProjectResponseDTO;
import com.gl.projectService.dto.StoryRequestDTO;
import com.gl.projectService.entity.PostType;
import com.gl.projectService.entity.Project;
import com.gl.projectService.exception.ProjectNotFoundException;
import com.gl.projectService.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;


    @Override
    public ProjectResponseDTO createProject(Long founderId, ProjectRequestDTO request) {
        log.debug("Creating project for founderId: {}", founderId);

        Project project = Project.builder()
                .founderId(founderId)
                .title(request.getTitle())
                .description(request.getDescription())
                .technologyStack(request.getTechnologyStack())
                .postType(PostType.PROJECT)
                .totalOpenings(request.getTotalOpenings())
                .filledOpenings(0)
                .isActive(true)
                .build();

        Project saved = projectRepository.save(project);
        log.debug("Project created with id: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public ProjectResponseDTO createStory(Long founderId, StoryRequestDTO request) {
        log.debug("Creating story for founderId: {}", founderId);

        Project story = Project.builder()
                .founderId(founderId)
                .title(request.getTitle())
                .description(request.getDescription())
                .postType(PostType.STORY)
                .totalOpenings(0)
                .filledOpenings(0)
                .isActive(false)
                .build();

        Project saved = projectRepository.save(story);
        log.debug("Story created with id: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Override
    public List<ProjectResponseDTO> getStoryFeed() {
        log.debug("Fetching story feed");
        return projectRepository
                .findByPostTypeOrderByCreatedAtDesc(PostType.STORY, PageRequest.of(0, 20))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponseDTO> getProjectOpenings() {
        log.debug("Fetching project openings");
        return projectRepository
                .findByPostTypeAndIsActiveTrueOrderByCreatedAtDesc(PostType.PROJECT, PageRequest.of(0, 20))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponseDTO getProjectById(Long id) throws ProjectNotFoundException {
        log.debug("Fetching project with id: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(
                        "Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Override
    public void deleteProject(Long id, Long requestingFounderId) throws ProjectNotFoundException {
        log.debug("Deleting project id: {} by founderId: {}", id, requestingFounderId);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(
                        "Project not found with id: " + id));

        if (!project.getFounderId().equals(requestingFounderId)) {
            throw new SecurityException("You are not authorized to delete this project");
        }

        projectRepository.deleteById(id);
        log.debug("Project id: {} deleted successfully", id);
    }

    private ProjectResponseDTO mapToResponse(Project project) {
        return ProjectResponseDTO.builder()
                .id(project.getId())
                .founderId(project.getFounderId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologyStack(project.getTechnologyStack())
                .postType(project.getPostType())
                .totalOpenings(project.getTotalOpenings())
                .filledOpenings(project.getFilledOpenings())
                .isActive(project.isActive())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
