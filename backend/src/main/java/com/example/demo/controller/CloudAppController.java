package com.example.demo.controller;

import com.example.demo.model.CloudApp;
import com.example.demo.repository.CloudAppRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/apps")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CloudAppController {

    @Autowired
    private CloudAppRepository repository;

    @GetMapping
    public List<CloudApp> getAllApps() {
        return repository.findAll();
    }

    @PostMapping
    public CloudApp createApp(@RequestBody CloudApp app) {
        if (app.getId() == null || app.getId().isEmpty()) {
            app.setId("app-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (app.getCreatedAt() == null || app.getCreatedAt().isEmpty()) {
            app.setCreatedAt(Instant.now().toString());
        }
        if(app.getUsageCount() == null) app.setUsageCount(0);
        return repository.save(app);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CloudApp> updateApp(@PathVariable String id, @RequestBody CloudApp appDetails) {
        return repository.findById(id).map(app -> {
            if (appDetails.getName() != null) app.setName(appDetails.getName());
            if (appDetails.getDescription() != null) app.setDescription(appDetails.getDescription());
            if (appDetails.getProvider() != null) app.setProvider(appDetails.getProvider());
            if (appDetails.getStatus() != null) app.setStatus(appDetails.getStatus());
            if (appDetails.getPricing() != null) app.setPricing(appDetails.getPricing());
            if (appDetails.getCategory() != null) app.setCategory(appDetails.getCategory());
            
            if (appDetails.getUsageCount() != null) {
                app.setUsageCount(appDetails.getUsageCount());
            }
            
            return ResponseEntity.ok(repository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApp(@PathVariable String id) {
        return repository.findById(id).map(app -> {
            repository.delete(app);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
