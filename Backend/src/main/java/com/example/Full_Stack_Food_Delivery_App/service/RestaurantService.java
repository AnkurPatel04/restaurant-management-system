package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.RestaurantRequest;
import com.example.Full_Stack_Food_Delivery_App.io.RestaurantResponse;

import java.util.List;

public interface RestaurantService {

    RestaurantResponse createRestaurant(RestaurantRequest request);

    List<RestaurantResponse> getAllRestaurants();

}