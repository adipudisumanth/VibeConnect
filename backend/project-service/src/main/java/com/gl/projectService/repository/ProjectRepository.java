package com.gl.projectService.repository;

import com.gl.projectService.entity.PostType;
import com.gl.projectService.entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository  // ← must be here
public interface ProjectRepository extends JpaRepository<Project,Long> {

    List<Project> findByPostTypeOrderByCreatedAtDesc(
            PostType postType, Pageable pageable
    );

    // Projects tab — active openings only, latest first
    List<Project> findByPostTypeAndIsActiveTrueOrderByCreatedAtDesc(
            PostType postType, Pageable pageable
    );
}
