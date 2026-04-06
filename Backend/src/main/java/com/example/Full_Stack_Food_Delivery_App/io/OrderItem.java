package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItem {

    private String foodId;
    private int quantity;
    private double price;
    private String category;
    private String imageUrl;
    private String description;
    private String name;
}
