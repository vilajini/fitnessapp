package com.example.backend.repository;

import com.example.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserManagementRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}