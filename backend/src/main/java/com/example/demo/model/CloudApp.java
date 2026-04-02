package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cloud_apps")
public class CloudApp {
    @Id
    private String id;
    
    private String name;
    private String description;
    private String provider;
    private String status;
    private String pricing;
    private String category;
    private Integer usageCount;
    private String createdAt;

    public CloudApp() {}

    public CloudApp(String id, String name, String description, String provider, String status, String pricing, String category, Integer usageCount, String createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.provider = provider;
        this.status = status;
        this.pricing = pricing;
        this.category = category;
        this.usageCount = usageCount;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPricing() { return pricing; }
    public void setPricing(String pricing) { this.pricing = pricing; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getUsageCount() { return usageCount; }
    public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
