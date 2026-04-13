package com.gl.projectService.controller;


import com.gl.projectService.dto.ProjectRequestDTO;
import com.gl.projectService.dto.ProjectResponseDTO;
import com.gl.projectService.dto.StoryRequestDTO;
import com.gl.projectService.exception.ProjectNotFoundException;
import com.gl.projectService.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceController {

    private final ProjectService projectService;

    // ─── US-005 Create Story or Post ──────────────────────────────────────
    /**
     * POST /api/projects
     * Founder creates a new project opportunity.
     */
    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(
            @RequestHeader("X-User-Id") Long founderId,
            @Valid @RequestBody ProjectRequestDTO request) {

        log.debug("POST /api/projects by founderId: {}", founderId);
        ProjectResponseDTO response = projectService.createProject(founderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/projects/stories
     * Founder creates a new story/journey post.
     */
    @PostMapping("/stories")
    public ResponseEntity<ProjectResponseDTO> createStory(
            @RequestHeader("X-User-Id") Long founderId,
            @Valid @RequestBody StoryRequestDTO request) {

        log.debug("POST /api/projects/stories by founderId: {}", founderId);
        ProjectResponseDTO response = projectService.createStory(founderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── US-006 Get Story Feed and project openings ─────────────────────────────────────────

    /**
     * Story
     * GET /api/projects/feed
     * Returns top 20story posts for home feed.
     */
    @GetMapping("/feed")
    public ResponseEntity<List<ProjectResponseDTO>> getStoryFeed() {
        log.debug("GET /api/projects/feed");
        List<ProjectResponseDTO> feed = projectService.getStoryFeed();
        return ResponseEntity.ok(feed);
    }

    /**
     * Project
     * GET /api/projects/openings
     * Returns top 20 active project openings.
     */
    @GetMapping("/openings")
    public ResponseEntity<List<ProjectResponseDTO>> getProjectOpenings() {
        log.debug("GET /api/projects/openings");
        List<ProjectResponseDTO> openings = projectService.getProjectOpenings();
        return ResponseEntity.ok(openings);
    }

    // ─── US-007 Get Project By ID ──────────────────────────────────────

    /**
     * GET /api/projects/{id}
     * Returns full details of a specific project or story.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id) throws ProjectNotFoundException {
        log.debug("GET /api/projects/{}", id);
        ProjectResponseDTO response = projectService.getProjectById(id);
        return ResponseEntity.ok(response);
    }
    // ─── US-008 Delete Project ─────────────────────────────────────────

    /**
     * DELETE /api/projects/{id}
     * Founder deletes their own project or story post.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long founderId) throws ProjectNotFoundException {

        log.debug("DELETE /api/projects/{} by founderId: {}", id, founderId);
        projectService.deleteProject(id, founderId);
        return ResponseEntity.ok("Project deleted successfully");
    }

    @GetMapping("/founder/{id}")
    public ResponseEntity<List<ProjectResponseDTO>> getMethodName(@PathVariable Long id) throws ProjectNotFoundException{
        log.debug("GET /api/projects/founder/{}", id);
        List<ProjectResponseDTO> projects = projectService.getProjectsByFounderId(id);
        return ResponseEntity.ok(projects);
    }
    
    @PutMapping("/{id}/increment-filled-openings")
    public ResponseEntity<String> incrementFilledOpenings(@PathVariable Long id) throws ProjectNotFoundException {
        log.debug("PUT /api/projects/{}/increment-filled-openings", id);
        projectService.incrementFilledOpenings(id);
        return ResponseEntity.ok("Filled openings incremented successfully");
    }

    @PutMapping("/{id}/decrement-filled-openings")
    public ResponseEntity<String> decrementFilledOpenings(@PathVariable Long id) throws ProjectNotFoundException {
        log.debug("PUT /api/projects/{}/decrement-filled-openings", id);
        projectService.decrementFilledOpenings(id);
        return ResponseEntity.ok("Filled openings decremented successfully");
    }

}
