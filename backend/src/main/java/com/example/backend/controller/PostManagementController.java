package com.example.backend.controller;// PostController.java

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.backend.model.CommentModel;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.service.PostManagementService;
import com.example.backend.service.UserManagementService;

@RestController
@RequestMapping("/api/posts")
public class PostManagementController {

    private final String uploadDir = "../../../../frontend/src/components/post/postimages";

    @Autowired
    private PostManagementService postManagementService;
    @Autowired
    private UserManagementService userManagementService; // Injecting the UserService

    @Autowired
    private Cloudinary cloudinary;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postManagementService.findAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postManagementService.findPostById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postManagementService.findPostsByUserId(userId);
        if (posts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> addLike(@PathVariable String postId) {
        return postManagementService.findPostById(postId)
                .map(post -> {
                    post.setLikes(post.getLikes() + 1);
                    postManagementService.savePost(post);
                    return ResponseEntity.ok(post);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> addComment(@PathVariable String postId, @RequestBody CommentModel commentModel) {
        return postManagementService.findPostById(postId)
                .map(post -> {
                    // Generate a unique ID for the comment
                    String commentId = UUID.randomUUID().toString();
                    commentModel.setId(commentId);
                    post.addComment(commentModel);
                    postManagementService.savePost(post);
                    return ResponseEntity.ok(post);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody CommentModel updatedCommentModel) {
        return postManagementService.findPostById(postId)
                .map(post -> {
                    Optional<CommentModel> optionalComment = post.getComments().stream()
                            .filter(commentModel -> commentModel.getId().equals(commentId))
                            .findFirst();
                    if (optionalComment.isPresent()) {
                        CommentModel commentModel = optionalComment.get();
                        commentModel.setText(updatedCommentModel.getText()); // Update comment text
                        postManagementService.savePost(post);
                        return ResponseEntity.ok(post);
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId) {
        return postManagementService.findPostById(postId)
                .map(post -> {
                    Optional<CommentModel> optionalComment = post.getComments().stream()
                            .filter(commentModel -> commentModel.getId().equals(commentId))
                            .findFirst();
                    if (optionalComment.isPresent()) {
                        CommentModel commentModel = optionalComment.get();
                        post.removeComment(commentModel); // Remove comment from post
                        postManagementService.savePost(post);
                        return ResponseEntity.ok().build();
                    } else {
                        return ResponseEntity.notFound().build();
                    }
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("description") String description,
            @RequestParam("title") String title,
            @RequestParam("userId") String userId,
            @RequestParam("files") MultipartFile[] files) {

        try {
            // Check if the user exists
            Optional<User> userOptional = userManagementService.findUserById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Extract user's name
            String userName = userOptional.get().getName();

            // Check the number of files uploaded
            if (files.length > 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No more than 3 files can be uploaded.");
            }

            // Upload files to Cloudinary
            List<String> mediaUrls = uploadFilesToCloudinary(files);

            // Create a new post
            Post post = new Post();
            post.setDescription(description);
            post.setTitle(title);
            post.setMediaUrls(mediaUrls);
            post.setUser(userOptional.get());
            post.setUserName(userName); // Set the user's name

            // Save the post
            Post savedPost = postManagementService.savePost(post);

            // Return the saved post
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (IOException e) {
            // Handle IO exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while saving files.");
        } catch (Exception e) {
            // Handle other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    private List<String> uploadFilesToCloudinary(MultipartFile[] files) throws IOException {
        List<String> mediaUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            // Check if the file is an image or a video
            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("image")) {
                // Handle image file
                Map<String, String> params = ObjectUtils.asMap("folder", "your_cloudinary_image_folder");
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
                mediaUrls.add(uploadResult.get("secure_url").toString());
            } else if (contentType != null && contentType.startsWith("video")) {
                // Handle video file
                Map<String, String> params = ObjectUtils.asMap("folder", "your_cloudinary_video_folder");
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
                mediaUrls.add(uploadResult.get("secure_url").toString());
            } else {
                // Unsupported file type
                throw new IllegalArgumentException("Unsupported file type: " + contentType);
            }
        }
        return mediaUrls;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable String id,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam String description) {

        Optional<Post> optionalPost = postManagementService.findPostById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();
        try {
            if (files != null && files.length > 0) {
                List<String> mediaUrls = uploadFilesToCloudinary(files);
                post.setMediaUrls(mediaUrls);
            }
            post.setDescription(description);
            Post updatedPost = postManagementService.updatePost(post);
            return ResponseEntity.ok(updatedPost);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating post.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        return postManagementService.findPostById(id)
                .map(post -> {
                    postManagementService.deletePost(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private List<String> saveFiles(MultipartFile[] files) throws IOException {
        List<String> mediaUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Path.of(uploadDir, fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            mediaUrls.add(filePath.toString());
        }
        return mediaUrls;
    }
}