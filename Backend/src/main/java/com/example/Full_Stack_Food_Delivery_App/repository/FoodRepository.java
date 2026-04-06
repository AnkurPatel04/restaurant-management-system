package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FoodRepository extends MongoRepository<FoodEntity,String> {
    List<FoodEntity> findByRestaurantId(String restaurantId);
}
