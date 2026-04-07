package com.gl.application_service.controller;

import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.enums.Status;
import com.gl.application_service.exception.ApplicationNotFoundException;
import com.gl.application_service.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<String> createApplication(@Valid @RequestBody ApplicationDTO applicationDTO)
            throws ApplicationNotFoundException {

        applicationService.createApplication(applicationDTO);
        return ResponseEntity.ok("Application submitted successfully");
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByProject(@PathVariable Long projectId)
            throws ApplicationNotFoundException {

        return ResponseEntity.ok(applicationService.getAllApplicationsOfProject(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByUser(@PathVariable Long userId)
            throws ApplicationNotFoundException {

        return ResponseEntity.ok(applicationService.getAllApplicationsOfUser(userId));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam Status status)
            throws ApplicationNotFoundException {

        applicationService.updateStatus(applicationId, status);
        return ResponseEntity.ok("Application status updated successfully");
    }
}
