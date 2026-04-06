package com.example.Full_Stack_Food_Delivery_App.io;


import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String email;
    private String otp;
    private String newPassword;

}