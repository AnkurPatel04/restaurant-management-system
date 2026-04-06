package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.RestaurantResponse;
import com.example.Full_Stack_Food_Delivery_App.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // public endpoint for users
    @GetMapping
    public List<RestaurantResponse> getRestaurants() {
        return restaurantService.getAllRestaurants();
    }

}