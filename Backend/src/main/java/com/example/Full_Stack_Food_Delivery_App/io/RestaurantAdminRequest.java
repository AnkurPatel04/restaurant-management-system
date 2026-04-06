package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class RestaurantAdminRequest {

    private String name;
    private String email;
    private String password;
    private String restaurantId;

}