package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class StaffRequest {
    private String restaurantId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean active;
}
