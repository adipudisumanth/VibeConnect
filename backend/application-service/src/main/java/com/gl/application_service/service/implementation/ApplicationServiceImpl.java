package com.gl.application_service.service.implementation;

import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.entity.Application;
import com.gl.application_service.enums.Status;
import com.gl.application_service.exception.ApplicationNotFoundException;
import com.gl.application_service.repository.ApplicationRepository;
import com.gl.application_service.service.ApplicationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    ApplicationRepository applicationRepository;
    public ApplicationServiceImpl(ApplicationRepository applicationRepository){
        this.applicationRepository=applicationRepository;
    }

    @Override
    public void createApplication(ApplicationDTO applicationDTO) throws ApplicationNotFoundException {
        Application application = applicationRepository.findByProjectIdAndUserId(applicationDTO.getProjectId(),applicationDTO.getUserId());
        if(application!=null){
            throw new ApplicationNotFoundException("Application Already Exists with project Id:"+applicationDTO.getProjectId()+"user Id: "+applicationDTO.getUserId());
        }
        application = new Application();
        application.setStatus(Status.PENDING);
        application.setUserId(applicationDTO.getUserId());
        application.setProjectId(applicationDTO.getProjectId());
        applicationRepository.save(application);
    }

    @Override
    public List<ApplicationDTO> getAllApplicationsOfProject(Long projectId) throws ApplicationNotFoundException {

        List<Application> applications = applicationRepository.findByProjectId(projectId);

        if (applications.isEmpty()) {
            throw new ApplicationNotFoundException("No applications found for project ID: " + projectId);
        }

        return applications.stream()
                .map(this::convertEntityToDto)
                .toList();
    }

    @Override
    public List<ApplicationDTO> getAllApplicationsOfUser(Long userId) throws ApplicationNotFoundException {

        List<Application> applications = applicationRepository.findByUserId(userId);

        if (applications.isEmpty()) {
            throw new ApplicationNotFoundException("No applications found for user ID: " + userId);
        }

        return applications.stream()
                .map(this::convertEntityToDto)
                .toList();
    }

    @Override
    public void updateStatus(Long applicationId, Status status) throws ApplicationNotFoundException {

        Application application = applicationRepository.findByApplicationId(applicationId);
        if(application==null){
            throw new ApplicationNotFoundException(
                    "Application not found with ID: " + applicationId
            );
        }

        application.setStatus(status);

        applicationRepository.save(application);
    }
    public ApplicationDTO convertEntityToDto(Application application) {
        if (application == null) {
            return null;
        }

        return new ApplicationDTO(
                application.getApplicationId(),
                application.getProjectId(),
                application.getUserId(),
                application.getStatus(),
                application.getAppliedAt(),
                application.getUpdatedAt()
        );
    }

}
