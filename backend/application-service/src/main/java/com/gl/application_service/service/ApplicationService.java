package com.gl.application_service.service;

import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.enums.Status;
import com.gl.application_service.exception.ApplicationNotFoundException;

import java.util.List;

public interface ApplicationService {
    public void createApplication(ApplicationDTO applicationDTO) throws ApplicationNotFoundException;
    public List<ApplicationDTO> getAllApplicationsOfProject(Long projectId) throws ApplicationNotFoundException;
    public List<ApplicationDTO> getAllApplicationsOfUser(Long userId) throws ApplicationNotFoundException;
    public void updateStatus(Long applicationId, Status status) throws ApplicationNotFoundException;

}
