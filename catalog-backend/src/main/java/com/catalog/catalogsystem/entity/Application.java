package com.catalog.catalogsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long appId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String version;

    @Column(length = 2000)
    private String description;

    private String url;

    private String tags; // Stored as comma-separated values

    @Column(nullable = false)
    private Integer usageCount = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    // A list of applications this application depends on
    @ManyToMany
    @JoinTable(
        name = "application_dependencies",
        joinColumns = @JoinColumn(name = "app_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_id")
    )
    private Set<Application> dependencies = new HashSet<>();
}
