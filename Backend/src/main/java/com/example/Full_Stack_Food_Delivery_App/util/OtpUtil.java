package com.example.Full_Stack_Food_Delivery_App.util;

public class OtpUtil {

    public static String generateOtp() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }
}
