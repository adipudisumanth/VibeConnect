package com.gl.projectService.service;

import com.gl.projectService.dto.ProjectRequestDTO;
import com.gl.projectService.dto.ProjectResponseDTO;
import com.gl.projectService.dto.StoryRequestDTO;
import com.gl.projectService.exception.ProjectNotFoundException;

import java.util.List;

public interface ProjectService  {
    // US-005
    ProjectResponseDTO createProject(Long founderId, ProjectRequestDTO request);
    ProjectResponseDTO createStory(Long founderId, StoryRequestDTO request);

    // US-006
    List<ProjectResponseDTO> getStoryFeed();
    List<ProjectResponseDTO> getProjectOpenings();

    // US-007
    ProjectResponseDTO getProjectById(Long id) throws ProjectNotFoundException;

    // US-008
    void deleteProject(Long id, Long requestingFounderId) throws ProjectNotFoundException;
}
