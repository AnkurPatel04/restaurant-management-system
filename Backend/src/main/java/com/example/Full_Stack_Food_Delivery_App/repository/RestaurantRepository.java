package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.RestaurantEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantRepository extends MongoRepository<RestaurantEntity, String> {

}