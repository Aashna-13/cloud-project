package com.catalog.catalogsystem.controller;

import com.catalog.catalogsystem.dto.ApplicationDTO;
import com.catalog.catalogsystem.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/apps")
@CrossOrigin(origins = "*") // For development purposes. Restrict in prod.
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<Page<ApplicationDTO>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getAllApplications(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PostMapping("/{id}/launch")
    public ResponseEntity<ApplicationDTO> launchApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.launchApplication(id));
    }

    @PostMapping
    public ResponseEntity<ApplicationDTO> createApplication(@Valid @RequestBody ApplicationDTO dto) {
        return new ResponseEntity<>(applicationService.createApplication(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationDTO> updateApplication(
            @PathVariable Long id, @Valid @RequestBody ApplicationDTO dto) {
        return ResponseEntity.ok(applicationService.updateApplication(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ApplicationDTO>> searchApplications(@RequestParam String keyword) {
        return ResponseEntity.ok(applicationService.searchApplications(keyword));
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<ApplicationDTO>> getRecommendations(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getRecommendations(id));
    }

    @GetMapping("/recommendations/global")
    public ResponseEntity<List<ApplicationDTO>> getGlobalRecommendations() {
        return ResponseEntity.ok(applicationService.getGlobalRecommendations());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(applicationService.getAnalytics());
    }
}
