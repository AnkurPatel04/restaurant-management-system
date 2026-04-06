package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.CartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<CartEntity,String> {
    Optional<CartEntity> findByUserIdAndRestaurantId(String userId, String restaurantId);

    void deleteByUserIdAndRestaurantId(String userId, String restaurantId);
}
