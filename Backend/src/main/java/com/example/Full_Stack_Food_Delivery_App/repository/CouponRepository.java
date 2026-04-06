package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.CouponEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends MongoRepository<CouponEntity,String> {

    Optional<CouponEntity> findByCodeAndRestaurantId(String code, String restaurantId);
    List<CouponEntity> findByRestaurantId(String restaurantId);
}
