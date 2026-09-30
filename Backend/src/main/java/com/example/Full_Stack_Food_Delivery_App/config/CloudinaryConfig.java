package com.example.Full_Stack_Food_Delivery_App.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name:dtsgo3kxk}")
    private String cloudName;

    @Value("${cloudinary.api_key:557257297368369}")
    private String apiKey;

    @Value("${cloudinary.api_secret:9UaIiY7L0QdIfnxpzivCisGhmzs}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }
}


