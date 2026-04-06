package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.RestaurantAdminRequest;
import com.example.Full_Stack_Food_Delivery_App.io.UserRequest;
import com.example.Full_Stack_Food_Delivery_App.io.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest userRequest);
    UserResponse createRestaurantAdmin(RestaurantAdminRequest request);
}
