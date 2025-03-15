package com.example.backend.repository;

import com.example.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostManagementRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
}