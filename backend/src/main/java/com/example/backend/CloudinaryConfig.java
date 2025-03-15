package com.example.backend;

// CloudinaryConfig.java
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        // Initialize Cloudinary with your cloud name, API key, and API secret
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dtgg92ztz",
                "api_key", "828339954714752",
                "api_secret", "zeequcBM7oTE_kDi-fU4Az_CkJc"));
        return cloudinary;
    }
}
