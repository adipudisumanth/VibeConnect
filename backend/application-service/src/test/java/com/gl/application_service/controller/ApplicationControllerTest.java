package com.gl.application_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gl.application_service.dto.ApplicationDTO;
import com.gl.application_service.enums.Status;
import com.gl.application_service.service.ApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
@Import({
        ApplicationControllerTest.TestConfig.class
})
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApplicationService service;

    @Autowired
    private ObjectMapper objectMapper;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public ApplicationService applicationService() {
            return mock(ApplicationService.class);
        }
    }

    @Test
    void createApplication_ShouldReturnSuccessMessage() throws Exception {
        ApplicationDTO dto = new ApplicationDTO(null, 10L, 20L, null, null, null);

        doNothing().when(service).createApplication(any());

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Application submitted successfully"));
    }

    @Test
    void getApplicationsByProject_ShouldReturnList() throws Exception {
        ApplicationDTO dto = new ApplicationDTO(1L, 10L, 20L, Status.PENDING, null, null);

        when(service.getAllApplicationsOfProject(10L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/applications/project/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void getApplicationsByUser_ShouldReturnList() throws Exception {
        ApplicationDTO dto = new ApplicationDTO(1L, 10L, 20L, Status.PENDING, null, null);

        when(service.getAllApplicationsOfUser(20L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/applications/user/20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    void updateStatus_ShouldReturnSuccessMessage() throws Exception {

        doNothing().when(service).updateStatus(1L, Status.ACCEPTED);

        mockMvc.perform(put("/api/applications/1/status")
                        .param("status", "ACCEPTED"))
                .andExpect(status().isOk())
                .andExpect(content().string("Application status updated successfully"));
    }
}