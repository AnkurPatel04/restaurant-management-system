package com.example.Full_Stack_Food_Delivery_App.controller;


import com.example.Full_Stack_Food_Delivery_App.io.RestaurantAdminRequest;
import com.example.Full_Stack_Food_Delivery_App.io.RestaurantRequest;
import com.example.Full_Stack_Food_Delivery_App.io.RestaurantResponse;
import com.example.Full_Stack_Food_Delivery_App.io.UserResponse;
import com.example.Full_Stack_Food_Delivery_App.service.RestaurantService;
import com.example.Full_Stack_Food_Delivery_App.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/main-admin")
@RequiredArgsConstructor
public class MainAdminController {

    private final RestaurantService restaurantService;
    private final UserService userService;

    // Create Restaurant
    @PostMapping("/restaurants")
    public RestaurantResponse createRestaurant(@RequestBody RestaurantRequest request) {
        return restaurantService.createRestaurant(request);
    }

    // Get all restaurants
    @GetMapping("/restaurants")
    public List<RestaurantResponse> getRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // Create Restaurant Admin
    @PostMapping("/restaurant-admin")
    public UserResponse createRestaurantAdmin(@RequestBody RestaurantAdminRequest request) {
        return userService.createRestaurantAdmin(request);
    }
}