package com.example.Full_Stack_Food_Delivery_App.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user")
@Builder
public class UserEntity {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private Role role;

    // OTP login fields
    private String otp;
    private LocalDateTime otpExpiry;

    //for admin
    private String phone;    // ✅ add
    private boolean active;

    private String restaurantId;//for  admin and staff.
}
