package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CouponRequest {

    private String code;
    private double discount;
    private String type;
    private boolean active;
    private LocalDate expiryDate;
    private String restaurantId;

}