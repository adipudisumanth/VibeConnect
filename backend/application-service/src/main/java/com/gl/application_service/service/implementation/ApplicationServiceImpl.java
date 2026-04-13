package com.gl.application_service.service.implementation;

import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.entity.Application;
import com.gl.application_service.enums.Status;
import com.gl.application_service.exception.ApplicationNotFoundException;
import com.gl.application_service.repository.ApplicationRepository;
import com.gl.application_service.service.ApplicationService;
import org.springframework.stereotype.Service;

import java.util.List;

import com.gl.application_service.client.ProjectFeignClient;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ProjectFeignClient projectFeignClient;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository, ProjectFeignClient projectFeignClient){
        this.applicationRepository = applicationRepository;
        this.projectFeignClient = projectFeignClient;
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

        // Only increment if we're moving precisely to ACCEPTED status
        if (status == Status.ACCEPTED && application.getStatus() != Status.ACCEPTED) {
            projectFeignClient.incrementFilledOpenings(application.getProjectId());
        }

        application.setStatus(status);

        applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Long applicationId) throws ApplicationNotFoundException {
        Application application = applicationRepository.findByApplicationId(applicationId);
        if (application==null) {
            throw new ApplicationNotFoundException("Application not found with ID: " + applicationId);
        }
        
        // Only decrement slots if this application had actually occupied a slot (ACCEPTED)
        if (application.getStatus() == Status.ACCEPTED) {
            projectFeignClient.decrementFilledOpenings(application.getProjectId());
        }
        
        applicationRepository.deleteById(applicationId);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteAllApplicationsForProject(Long projectId) {
        applicationRepository.deleteByProjectId(projectId);
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
