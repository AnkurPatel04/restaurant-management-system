package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class TableRequest {
    private int tableNumber;
    private int seats;
    private String status;
    private String restaurantId;
}