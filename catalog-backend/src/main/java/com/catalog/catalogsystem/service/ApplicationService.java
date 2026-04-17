package com.catalog.catalogsystem.service;

import com.catalog.catalogsystem.dto.ApplicationDTO;
import com.catalog.catalogsystem.dto.DependencyInfoDTO;
import com.catalog.catalogsystem.entity.Application;
import com.catalog.catalogsystem.exception.ResourceNotFoundException;
import com.catalog.catalogsystem.repository.ApplicationRepository;
import com.catalog.catalogsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public Page<ApplicationDTO> getAllApplications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return applicationRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public ApplicationDTO getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        
        return convertToDto(app);
    }

    @Transactional
    public ApplicationDTO launchApplication(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        
        // Explicitly track usage when launched
        app.setUsageCount(app.getUsageCount() + 1);
        app = applicationRepository.save(app);
        
        return convertToDto(app);
    }

    @Transactional
    public ApplicationDTO createApplication(ApplicationDTO dto) {
        Application app = modelMapper.map(dto, Application.class);
        app.setUsageCount(0); // init
        
        if (dto.getDependencyIds() != null && !dto.getDependencyIds().isEmpty()) {
            Set<Application> dependencies = dto.getDependencyIds().stream()
                .map(depId -> applicationRepository.findById(depId)
                    .orElseThrow(() -> new ResourceNotFoundException("Dependency not found with id: " + depId)))
                .collect(Collectors.toSet());
            app.setDependencies(dependencies);
        }
        
        app = applicationRepository.save(app);
        return convertToDto(app);
    }

    @Transactional
    public ApplicationDTO updateApplication(Long id, ApplicationDTO dto) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        
        app.setName(dto.getName());
        app.setCategory(dto.getCategory());
        app.setVersion(dto.getVersion());
        app.setDescription(dto.getDescription());
        app.setUrl(dto.getUrl());
        app.setTags(dto.getTags());
        
        if (dto.getDependencyIds() != null) {
            Set<Application> dependencies = dto.getDependencyIds().stream()
                .map(depId -> applicationRepository.findById(depId)
                    .orElseThrow(() -> new ResourceNotFoundException("Dependency not found with id: " + depId)))
                .collect(Collectors.toSet());
            app.setDependencies(dependencies);
        }
        
        app = applicationRepository.save(app);
        return convertToDto(app);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> searchApplications(String keyword) {
        return applicationRepository.searchByKeyword(keyword).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getRecommendations(Long appId) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + appId));
        
        // Simple recommendation logic: Same category, high usage, exclude self
        return applicationRepository.findByCategoryAndAppIdNotOrderByUsageCountDesc(app.getCategory(), appId)
                .stream()
                .limit(5)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getGlobalRecommendations() {
        Set<Application> blended = new LinkedHashSet<>();
        
        // 1. Add Top 2 Highest Usage (Usage constraint)
        List<Application> topUsed = applicationRepository.findTop5ByOrderByUsageCountDesc();
        blended.addAll(topUsed.stream().limit(2).collect(Collectors.toList()));
        
        // 2. Add Top 2 Recently Added (Recency constraint)
        List<Application> topRecent = applicationRepository.findTop5ByOrderByCreatedDateDesc();
        blended.addAll(topRecent.stream().limit(2).collect(Collectors.toList()));
        
        // 3. Ensure we have 5 recommendations by filling with trending (Category blending)
        for (Application app : topUsed) {
            if (blended.size() >= 5) break;
            blended.add(app);
        }

        List<ApplicationDTO> resultList = blended.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
                
        // 4. Fetch External Recommendations based on newest app's category
        if (!topRecent.isEmpty()) {
            String recentCat = topRecent.get(0).getCategory();
            List<ApplicationDTO> externalApps = getExternalRecommendations(recentCat);
            resultList.addAll(externalApps);
        }

        return resultList;
    }

    private List<ApplicationDTO> getExternalRecommendations(String term) {
        List<ApplicationDTO> externalList = new ArrayList<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://itunes.apple.com/search?entity=software&limit=3&term=" + term;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.getBody());
                JsonNode results = root.path("results");
                
                long fakeId = -1L;
                for (JsonNode node : results) {
                    ApplicationDTO dto = new ApplicationDTO();
                    dto.setAppId(fakeId--);
                    dto.setName(node.path("trackName").asText());
                    dto.setCategory(node.path("primaryGenreName").asText());
                    
                    String description = node.path("description").asText();
                    if (description.length() > 500) {
                        description = description.substring(0, 497) + "...";
                    }
                    dto.setDescription(description);
                    
                    dto.setVersion(node.path("version").asText());
                    dto.setUrl(node.path("trackViewUrl").asText());
                    dto.setUsageCount(node.path("userRatingCount").asInt(100)); // Map ratings to "usage" visually
                    dto.setTags("external, discovery, " + term.toLowerCase());
                    externalList.add(dto);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch external recommendations: " + e.getMessage());
        }
        return externalList;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Application> allApps = applicationRepository.findAll();
        analytics.put("totalApps", allApps.size());
        
        analytics.put("totalUsers", userRepository.count());
        
        List<ApplicationDTO> mostUsed = applicationRepository.findTop5ByOrderByUsageCountDesc()
                .stream().map(this::convertToDto).collect(Collectors.toList());
        analytics.put("mostUsedApplications", mostUsed);
        
        List<ApplicationDTO> latest = applicationRepository.findTop5ByOrderByCreatedDateDesc()
                .stream().map(this::convertToDto).collect(Collectors.toList());
        analytics.put("recentlyAdded", latest);
        
        Map<String, Long> categoryDistribution = allApps.stream()
                .collect(Collectors.groupingBy(Application::getCategory, Collectors.counting()));
        analytics.put("categoryDistribution", categoryDistribution);
        
        return analytics;
    }

    private ApplicationDTO convertToDto(Application entity) {
        ApplicationDTO dto = modelMapper.map(entity, ApplicationDTO.class);
        if (entity.getDependencies() != null) {
            List<DependencyInfoDTO> depInfos = entity.getDependencies().stream()
                .map(dep -> {
                    DependencyInfoDTO info = new DependencyInfoDTO();
                    info.setAppId(dep.getAppId());
                    info.setName(dep.getName());
                    info.setVersion(dep.getVersion());
                    return info;
                }).collect(Collectors.toList());
            dto.setDependencies(depInfos);
        }
        return dto;
    }
}
