package com.catalog.catalogsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ApplicationDTO {
    private Long appId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Version is required")
    private String version;

    private String description;
    
    private String url;
    
    private String tags;

    private Integer usageCount;

    private LocalDateTime createdDate;

    // List of brief dependency info to avoid circular references and huge payloads
    private List<DependencyInfoDTO> dependencies;
    
    // For submitting new dependencies (just IDs)
    private List<Long> dependencyIds;
}
