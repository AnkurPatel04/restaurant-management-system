package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class TableBookingRequest {

    private String userId;
    private String tableId;
    private String date;
    private String time;
    private int guests;
    private String name;
    private String phone;
    private String restaurantId;
}
