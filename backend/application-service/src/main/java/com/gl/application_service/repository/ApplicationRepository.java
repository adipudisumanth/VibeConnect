package com.gl.application_service.repository;

import com.gl.application_service.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    Application findByProjectIdAndUserId(Long projectId, Long userId);
    List<Application> findByProjectId(Long projectId);
    List<Application> findByUserId(Long userId);
    Application findByApplicationId(Long id);
    void deleteByProjectId(Long projectId);
}
