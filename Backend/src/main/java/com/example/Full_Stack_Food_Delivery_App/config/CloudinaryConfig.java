package com.example.Full_Stack_Food_Delivery_App.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dptpvnulg",
                "api_key", "169628244739196",
                "api_secret", "0gjdjOmrxLOnHbsLL3E9YgOqlBY"
        ));
    }
}


