package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.FoodRequest;
import com.example.Full_Stack_Food_Delivery_App.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface FoodService {

    Map uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    List<FoodResponse> readFood(String restaurantId);

    FoodResponse readFoodone(String id);

    void deleteFood(String id);

    FoodResponse updateFood(String id, FoodRequest request, MultipartFile file);

    FoodResponse updateFoodStatus(String id,boolean active);

}
