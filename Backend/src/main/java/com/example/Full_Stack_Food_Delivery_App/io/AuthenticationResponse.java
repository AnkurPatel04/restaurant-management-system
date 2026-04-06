package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
    private String userId;// Mongo _id
    private String email;
    private String token;
    private String role; // ADMIN or USER
    private String restaurantId;
}
