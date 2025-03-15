package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService {
    @Autowired
    private UserManagementRepository userManagementRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers() {
        return userManagementRepository.findAll();
    }

    public User getUserById(String id) {
        return userManagementRepository.findById(id).orElse(null);
    }

    public Optional<User> findUserById(String id) {
        return userManagementRepository.findById(id);
    }

    public User signupUser(User user) throws Exception {
        Optional<User> existingUser = userManagementRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new Exception("User already exists with this email");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userManagementRepository.save(user);
    }

    public User signInUser(String email, String password) throws Exception {
        Optional<User> user = userManagementRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user.get();
        } else {
            throw new Exception("Invalid email or password");
        }
    }

    public int getFollowersCount(String userId) {
        Optional<User> userOptional = userManagementRepository.findById(userId);
        return userOptional.map(user -> user.getFollowers().size()).orElse(0);
    }

    public User followUser(String userId, String followerId) {
        Optional<User> optionalUser = userManagementRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<String> followers = user.getFollowers();
            if (!followers.contains(followerId)) {
                followers.add(followerId);
                user.setFollowers(followers);
                return userManagementRepository.save(user);
            }
        }
        return null; // Handle error
    }

    public User unfollowUser(String userId, String followerId) {
        Optional<User> optionalUser = userManagementRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<String> followers = user.getFollowers();
            if (followers.contains(followerId)) {
                followers.remove(followerId);
                user.setFollowers(followers);
                return userManagementRepository.save(user);
            }
        }
        return null; // Handle error
    }

    public User updateUser(String id, User user) {
        return userManagementRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(user.getName());
                    existingUser.setEmail(user.getEmail());
                    return userManagementRepository.save(existingUser);
                }).orElseGet(() -> {
                    user.setId(id);
                    return userManagementRepository.save(user);
                });
    }

    public void deleteUser(String id) {
        userManagementRepository.deleteById(id);
    }
}