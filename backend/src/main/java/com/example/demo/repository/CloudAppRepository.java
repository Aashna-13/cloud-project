package com.example.demo.repository;

import com.example.demo.model.CloudApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CloudAppRepository extends JpaRepository<CloudApp, String> {
}
