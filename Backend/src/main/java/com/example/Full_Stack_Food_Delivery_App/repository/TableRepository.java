package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.TableEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends MongoRepository<TableEntity, String> {
    List<TableEntity> findByStatus(String status);
    Optional<TableEntity> findByTableNumber(int tableNumber);

    List<TableEntity> findByRestaurantId(String restaurantId);

    Optional<TableEntity> findByRestaurantIdAndTableNumber(
            String restaurantId,
            int tableNumber
    );

    List<TableEntity> findByRestaurantIdAndSeatsGreaterThanEqual(
            String restaurantId,
            int seats
    );





}