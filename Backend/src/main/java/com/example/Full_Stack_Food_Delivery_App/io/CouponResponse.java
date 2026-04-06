package com.example.Full_Stack_Food_Delivery_App.io;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CouponResponse {

    private String id;
    private String code;
    private double discount;
    private String type;
    private boolean active;
    private LocalDate expiryDate;
    private String restaurantId;

}