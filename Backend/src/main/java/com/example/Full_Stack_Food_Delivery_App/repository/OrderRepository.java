package com.example.Full_Stack_Food_Delivery_App.repository;



import com.example.Full_Stack_Food_Delivery_App.entity.OrderEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity, String> {

    // Get all orders of a user
    List<OrderEntity> findByUserId(String userId);

    OrderEntity findTopByOrderByCreatedAtDesc();
    List<OrderEntity> findAllByOrderByCreatedAtDesc();
    Optional<OrderEntity> findTopByUserIdOrderByCreatedAtDesc(String userId);
    List<OrderEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    List<OrderEntity> findByTableNumberAndPaymentStatusOrderByCreatedAtDesc(
            int tableNumber,
            String paymentStatus
    );
  List<OrderEntity> findByTableNumberAndPaymentStatus(int tableNumber, String paymentStatus);
    List<OrderEntity> findByRestaurantIdOrderByCreatedAtDesc(String restaurantId);

    List<OrderEntity> findByRestaurantIdAndTableNumberAndPaymentStatusOrderByCreatedAtDesc(
            String restaurantId,
            int tableNumber,
            String paymentStatus
    );

    List<OrderEntity> findByRestaurantIdAndUserIdOrderByCreatedAtDesc(
            String restaurantId,
            String userId
    );





}
