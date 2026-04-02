package com.example.demo.config;

import com.example.demo.model.AppUser;
import com.example.demo.model.CloudApp;
import com.example.demo.repository.AppUserRepository;
import com.example.demo.repository.CloudAppRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadData(AppUserRepository userRepository, CloudAppRepository appRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new AppUser("admin", "admin123", "admin", "Admin User"));
                userRepository.save(new AppUser("employee", "employee123", "employee", "Regular Employee"));
            }

            if (appRepository.count() == 0) {
                appRepository.saveAll(List.of(
                    new CloudApp("app-1", "Salesforce CRM", "Customer relationship management platform used by sales and marketing.", "Salesforce", "Active", "Per User", "Sales", 145, "2023-01-15T10:00:00Z"),
                    new CloudApp("app-2", "Google Workspace", "Productivity and collaboration tools including Gmail, Docs, and Drive.", "Google", "Active", "Enterprise Subscription", "Productivity", 850, "2022-06-01T08:30:00Z"),
                    new CloudApp("app-3", "Slack", "Team communication and collaboration hub.", "Slack Technologies", "Active", "Per User", "Communication", 920, "2022-08-10T09:15:00Z"),
                    new CloudApp("app-4", "Jira", "Issue and project tracking software for agile teams.", "Atlassian", "Active", "Tiered", "Development", 320, "2023-03-22T14:45:00Z"),
                    new CloudApp("app-5", "AWS Cloud", "Comprehensive cloud computing services for infrastructure.", "Amazon Web Services", "Active", "Pay-as-you-go", "Infrastructure", 110, "2021-11-05T11:20:00Z"),
                    new CloudApp("app-6", "Figma", "Collaborative interface design tool.", "Figma", "Under Review", "Per User", "Design", 45, "2023-09-12T16:00:00Z"),
                    new CloudApp("app-7", "Zoom", "Video conferencing and virtual meeting platform.", "Zoom Video Communications", "Deprecated", "Enterprise Subscription", "Communication", 210, "2020-03-15T08:00:00Z"),
                    new CloudApp("app-8", "Datadog", "Monitoring and security platform for cloud applications.", "Datadog", "Active", "Usage Based", "Development", 85, "2023-05-30T10:30:00Z")
                ));
            }
        };
    }
}
