package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private String email;
    private String currentPassword;
    private String newPassword;
}