package com.example.Full_Stack_Food_Delivery_App.repository;

import com.example.Full_Stack_Food_Delivery_App.entity.Role;
import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserEntity,String> {

    Optional<UserEntity> findByEmail(String email);

    List<UserEntity> findByRoleNot(Role role);

    List<UserEntity> findByNameContainingIgnoreCaseAndRoleNot(String name, Role role);
    List<UserEntity> findByRestaurantIdAndRoleNot(String restaurantId, Role role);

    List<UserEntity> findByRestaurantIdAndNameContainingIgnoreCaseAndRoleNot(
            String restaurantId,
            String name,
            Role role
    );
}
