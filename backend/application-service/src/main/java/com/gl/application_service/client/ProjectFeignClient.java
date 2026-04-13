package com.gl.application_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "PROJECT-SERVICE")
public interface ProjectFeignClient {

    @PutMapping("/api/projects/{projectId}/increment-filled-openings")
    void incrementFilledOpenings(@PathVariable("projectId") Long projectId);
    @PutMapping("/api/projects/{projectId}/decrement-filled-openings")
    void decrementFilledOpenings(@PathVariable("projectId") Long projectId);
}
