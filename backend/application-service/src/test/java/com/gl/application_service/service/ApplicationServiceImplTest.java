package com.gl.application_service.service;

import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.entity.Application;
import com.gl.application_service.enums.Status;
import com.gl.application_service.exception.ApplicationNotFoundException;
import com.gl.application_service.repository.ApplicationRepository;
import com.gl.application_service.service.implementation.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ApplicationServiceImplTest {

    @Mock
    private ApplicationRepository repository;

    @InjectMocks
    private ApplicationServiceImpl service;

    private Application application;

    @BeforeEach
    void setUp() {
        application = new Application();
        application.setApplicationId(1L);
        application.setProjectId(10L);
        application.setUserId(20L);
        application.setStatus(Status.PENDING);
    }

    @Test
    void createApplication_WhenDuplicateExists_ShouldThrowException() {
        ApplicationDTO dto = new ApplicationDTO(null, 10L, 20L, null, null, null);

        when(repository.findByProjectIdAndUserId(10L, 20L)).thenReturn(application);

        assertThrows(ApplicationNotFoundException.class,
                () -> service.createApplication(dto));
    }

    @Test
    void getAllApplicationsOfProject_WhenDataExists_ShouldReturnList() throws Exception {
        when(repository.findByProjectId(10L)).thenReturn(List.of(application));

        List<ApplicationDTO> result = service.getAllApplicationsOfProject(10L);

        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getProjectId());
    }

    @Test
    void getAllApplicationsOfProject_WhenEmpty_ShouldThrowException() {
        when(repository.findByProjectId(10L)).thenReturn(List.of());

        assertThrows(ApplicationNotFoundException.class,
                () -> service.getAllApplicationsOfProject(10L));
    }

    @Test
    void updateStatus_WhenApplicationExists_ShouldUpdate() throws Exception {
        when(repository.findByApplicationId(1L)).thenReturn(application);

        service.updateStatus(1L, Status.ACCEPTED);

        assertEquals(Status.ACCEPTED, application.getStatus());
        verify(repository).save(application);
    }

    @Test
    void updateStatus_WhenNotFound_ShouldThrowException() {
        when(repository.findByApplicationId(1L)).thenReturn(null);

        assertThrows(ApplicationNotFoundException.class,
                () -> service.updateStatus(1L, Status.ACCEPTED));
    }
}