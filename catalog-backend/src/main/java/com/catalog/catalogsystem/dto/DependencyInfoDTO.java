package com.catalog.catalogsystem.dto;

import lombok.Data;

@Data
public class DependencyInfoDTO {
    private Long appId;
    private String name;
    private String version;
}
