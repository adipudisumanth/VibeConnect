package com.gl.application_service.service;

import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.enums.Status;
import com.gl.application_service.exception.ApplicationNotFoundException;

import java.util.List;

public interface ApplicationService {
    void createApplication(ApplicationDTO applicationDTO) throws ApplicationNotFoundException;
    List<ApplicationDTO> getAllApplicationsOfProject(Long projectId) throws ApplicationNotFoundException;
    List<ApplicationDTO> getAllApplicationsOfUser(Long userId) throws ApplicationNotFoundException;
    void updateStatus(Long applicationId, Status status) throws ApplicationNotFoundException;
    void deleteApplication(Long applicationId) throws ApplicationNotFoundException;
    void deleteAllApplicationsForProject(Long projectId);

}
