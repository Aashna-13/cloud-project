package com.catalog.catalogsystem.config;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudformation.CloudFormationClient;
import software.amazon.awssdk.services.cloudformation.model.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

public class AWSDeployer {

    public static void main(String[] args) throws Exception {
        if (args.length < 3) {
            System.err.println("Usage: java AWSDeployer <AccessKey> <SecretKey> <TemplateFilePath>");
            System.exit(1);
        }

        String accessKey = args[0];
        String secretKey = args[1];
        String templatePath = args[2];
        String stackName = "CloudList-Deploy-Final";

        System.out.println("Starting automated AWS CloudFormation Deployment...");

        CloudFormationClient cfClient = CloudFormationClient.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .build();

        String templateBody = new String(Files.readAllBytes(Paths.get(templatePath)));

        System.out.println("Reading template: " + templatePath + " (Length: " + templateBody.length() + ")");

        Parameter dbUser = Parameter.builder().parameterKey("DBUsername").parameterValue("admin").build();
        Parameter dbPass = Parameter.builder().parameterKey("DBPassword").parameterValue("CloudPass123!").build();

        try {
            System.out.println("Initiating stack creation...");
            CreateStackRequest request = CreateStackRequest.builder()
                    .stackName(stackName)
                    .templateBody(templateBody)
                    .parameters(Arrays.asList(dbUser, dbPass))
                    .capabilities(Capability.CAPABILITY_NAMED_IAM)
                    .build();

            cfClient.createStack(request);
            
            System.out.println("==========================================");
            System.out.println("Stack Creation Initiated Successfully!");
            System.out.println("Stack Name: " + stackName);
            System.out.println("Check the AWS Console -> CloudFormation for live progress.");
            System.out.println("Wait about 5 minutes for the Database to spin up.");
            System.out.println("==========================================");

        } catch (AlreadyExistsException e) {
            System.out.println("Stack " + stackName + " already exists. Attempting update...");
            try {
                UpdateStackRequest updateRequest = UpdateStackRequest.builder()
                        .stackName(stackName)
                        .templateBody(templateBody)
                        .parameters(Arrays.asList(dbUser, dbPass))
                        .capabilities(Capability.CAPABILITY_NAMED_IAM)
                        .build();
                cfClient.updateStack(updateRequest);
                System.out.println("Stack Update Initiated Successfully!");
            } catch (Exception ex) {
                if (ex.getMessage().contains("No updates are to be performed")) {
                    System.out.println("No changes detected in template.");
                } else {
                    System.err.println("Failed to update stack: " + ex.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Fatal Error during deployment: " + e.getMessage());
            e.printStackTrace();
        } finally {
            cfClient.close();
        }
    }
}
