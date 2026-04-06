package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StaffResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean active;
}
