package com.catalog.catalogsystem.config;

import com.catalog.catalogsystem.entity.Application;
import com.catalog.catalogsystem.entity.AppUser;
import com.catalog.catalogsystem.repository.ApplicationRepository;
import com.catalog.catalogsystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadData(ApplicationRepository repository, UserRepository userRepository) {
        return args -> {
            // Initialize Users
            if (userRepository.count() == 0) {
                System.out.println("Initializing sample users...");
                AppUser user1 = AppUser.builder().username("admin").email("admin@cloud.com").role("ADMIN").build();
                AppUser user2 = AppUser.builder().username("jdoe").email("jdoe@cloud.com").role("EMPLOYEE").build();
                AppUser user3 = AppUser.builder().username("asmith").email("asmith@cloud.com").role("EMPLOYEE").build();
                AppUser user4 = AppUser.builder().username("bwillis").email("bwillis@cloud.com").role("EMPLOYEE").build();
                userRepository.saveAll(Arrays.asList(user1, user2, user3, user4));
            }

            if (repository.count() == 0) {
                System.out.println("Initializing sample data...");
                
                Application app1 = Application.builder()
                        .name("Cloud Storage Manager")
                        .category("Storage")
                        .version("1.2.0")
                        .description("S3 bucket manager UI")
                        .url("https://aws.amazon.com/s3")
                        .tags("aws,s3,storage")
                        .usageCount(150)
                        .dependencies(new HashSet<>())
                        .build();

                Application app2 = Application.builder()
                        .name("Data Pipeline Orchestrator")
                        .category("Data Engineering")
                        .version("2.0.1")
                        .description("ETL job orchestrator based on Airflow")
                        .url("https://airflow.apache.org")
                        .tags("data,etl,analytics")
                        .usageCount(85)
                        .dependencies(new HashSet<>())
                        .build();

                Application app3 = Application.builder()
                        .name("Identity Provider")
                        .category("Security")
                        .version("3.1.5")
                        .description("SSO and identity management service")
                        .url("https://auth0.com")
                        .tags("iam,security,auth")
                        .usageCount(320)
                        .dependencies(new HashSet<>())
                        .build();

                Application app4 = Application.builder()
                        .name("Log Aggregator")
                        .category("Monitoring")
                        .version("1.0.0")
                        .description("Centralized logging using ELK stack")
                        .url("https://www.elastic.co/elastic-stack")
                        .tags("logs,monitoring,elk")
                        .usageCount(45)
                        .dependencies(new HashSet<>())
                        .build();

                Application app5 = Application.builder()
                        .name("API Gateway")
                        .category("Networking")
                        .version("4.2.0")
                        .description("Central entry point for microservices routing")
                        .url("https://aws.amazon.com/api-gateway")
                        .tags("api,networking,routing")
                        .usageCount(500)
                        .dependencies(new HashSet<>())
                        .build();
                        
                // Save base apps
                List<Application> savedApps = repository.saveAll(Arrays.asList(app1, app2, app3, app4, app5));
                
                // create dependencies
                Application app6 = Application.builder()
                        .name("Billing Dashboard")
                        .category("Finance")
                        .version("1.1.0")
                        .description("Cost tracking and billing reports")
                        .url("https://aws.amazon.com/billing")
                        .tags("finance,cost")
                        .usageCount(120)
                        .dependencies(new HashSet<>(Arrays.asList(savedApps.get(2), savedApps.get(4)))) // depends on Identity Provider and API Gateway
                        .build();
                
                Application app7 = Application.builder()
                        .name("ML Model Server")
                        .category("AI/ML")
                        .version("0.9.5-beta")
                        .description("Inference server for deploying models")
                        .url("https://www.tensorflow.org/tfx/guide/serving")
                        .tags("ai,ml,inference")
                        .usageCount(30)
                        .dependencies(new HashSet<>(Arrays.asList(savedApps.get(0), savedApps.get(1)))) // depends on storage and data pipeline
                        .build();

                Application app8 = Application.builder()
                        .name("Customer Portal")
                        .category("Frontend")
                        .version("5.0.0")
                        .description("Main user-facing portal")
                        .url("https://reactjs.org")
                        .tags("ui,portal,react")
                        .usageCount(800)
                        .dependencies(new HashSet<>(Arrays.asList(savedApps.get(2), savedApps.get(4), app6)))
                        .build();

                Application app9 = Application.builder()
                        .name("Alerting Engine")
                        .category("Monitoring")
                        .version("2.1.0")
                        .description("Rule-based alerting for anomalous metrics and logs")
                        .url("https://prometheus.io/")
                        .tags("monitoring,alert")
                        .usageCount(210)
                        .dependencies(new HashSet<>(Arrays.asList(savedApps.get(3))))
                        .build();

                Application app10 = Application.builder()
                        .name("Container Registry")
                        .category("DevOps")
                        .version("3.0.0")
                        .description("Internal docker image repository")
                        .url("https://hub.docker.com/")
                        .tags("docker,registry,devops")
                        .usageCount(600)
                        .dependencies(new HashSet<>(Arrays.asList(savedApps.get(0), savedApps.get(2))))
                        .build();

                repository.saveAll(Arrays.asList(app6, app7, app8, app9, app10));
                
                System.out.println("Sample apps initialized successfully.");
            }
        };
    }
}
