package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String email;
    private String otp;
}
