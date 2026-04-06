package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.FoodRequest;
import com.example.Full_Stack_Food_Delivery_App.io.FoodResponse;
import com.example.Full_Stack_Food_Delivery_App.service.FoodService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FoodController {

    private final FoodService foodService;


    @PostMapping(value = "/add",consumes = "multipart/form-data")
    public FoodResponse addFood(
            @RequestPart("food") FoodRequest request,
            @RequestPart("file") MultipartFile file) {

        return foodService.addFood(request, file);
    }

    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    public FoodResponse updateFood(
            @PathVariable String id,
            @RequestPart("food") FoodRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {

        return foodService.updateFood(id, request, file);
    }


    @GetMapping("/restaurant/{restaurantId}")
    public List<FoodResponse> readFood(@PathVariable String restaurantId){
        return foodService.readFood(restaurantId);
    }

    @GetMapping("/{id}")
    public FoodResponse readFoodById(@PathVariable String id){
        return foodService.readFoodone(id);
    }

    @DeleteMapping("delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable String id) {
        foodService.deleteFood(id);
    }

    @PatchMapping("/status/{id}")
    public FoodResponse updateFoodStatus(@PathVariable String id,@RequestParam boolean active){
        return foodService.updateFoodStatus(id,active);

    }



}
