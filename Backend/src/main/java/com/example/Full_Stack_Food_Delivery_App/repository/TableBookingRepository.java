package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.TableBookingEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TableBookingRepository
        extends MongoRepository<TableBookingEntity, String> {

    List<TableBookingEntity> findByUserId(String userId);
    List<TableBookingEntity> findByDateAndTimeAndStatus(
            String date,
            String time,
            String status
    );
    List<TableBookingEntity> findByDate(String date);

    List<TableBookingEntity> findByStatus(String status);
    TableBookingEntity findTopByOrderByCreatedAtDesc();

    List<TableBookingEntity> findByRestaurantIdAndDateAndTimeAndStatus(
            String restaurantId,
            String date,
            String time,
            String status
    );

}
