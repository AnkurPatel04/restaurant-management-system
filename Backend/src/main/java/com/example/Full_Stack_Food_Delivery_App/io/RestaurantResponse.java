package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class RestaurantResponse {

    private String id;
    private String name;
    private String address;
    private String phone;
    private String email;
}