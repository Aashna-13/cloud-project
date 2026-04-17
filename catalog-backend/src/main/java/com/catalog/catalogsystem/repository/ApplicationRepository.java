package com.catalog.catalogsystem.repository;

import com.catalog.catalogsystem.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByCategory(String category);
    
    @Query("SELECT a FROM Application a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(a.category) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(a.tags) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Application> searchByKeyword(String keyword);

    List<Application> findTop5ByOrderByUsageCountDesc();
    
    List<Application> findTop5ByOrderByCreatedDateDesc();
    
    // For recommendation (same category, excluding self)
    List<Application> findByCategoryAndAppIdNotOrderByUsageCountDesc(String category, Long appId);
}
