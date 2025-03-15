package com.example.backend.service;

import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repository.PostManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostManagementService {
    @Autowired
    private PostManagementRepository postManagementRepository;

    @Autowired
    private UserManagementService userManagementService;

    public List<Post> findAllPosts() {
        List<Post> posts = postManagementRepository.findAll();
        posts.forEach(post -> {
            if (post.getUser() != null) {
                Optional<User> user = userManagementService.findUserById(post.getUser().getId());
                user.ifPresent(post::setUser);
            }
        });
        return posts;
    }

    public List<Post> findPostsByUserId(String userId) {
        return postManagementRepository.findByUserId(userId);
    }

    public Optional<Post> findPostById(String id) {
        return postManagementRepository.findById(id);
    }

    public Post savePost(Post post) {
        return postManagementRepository.save(post);
    }

    // Update an existing post
    public Post updatePost(Post postToUpdate) {
        // Assume repository is autowired and used here to save the updated post
        return postManagementRepository.save(postToUpdate);
    }

    public void deletePost(String id) {
        postManagementRepository.deleteById(id);
    }
}