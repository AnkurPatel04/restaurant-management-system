package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.Role;
import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import com.example.Full_Stack_Food_Delivery_App.io.RestaurantAdminRequest;
import com.example.Full_Stack_Food_Delivery_App.io.UserRequest;
import com.example.Full_Stack_Food_Delivery_App.io.UserResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class  UserServiceimpl implements UserService{


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRequest userRequest) {
        UserEntity newuser = covertToEntity(userRequest);
        newuser = userRepository.save(newuser);
        return convertToUserResponse(newuser);

    }

    private UserEntity covertToEntity(UserRequest request){

        Role role = Role.USER; // default role

        if(request.getRole() != null){
            role = Role.valueOf(request.getRole().toUpperCase());
        }

        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(role)
                .build();
    }

    @Override
    public UserResponse createRestaurantAdmin(RestaurantAdminRequest request) {

        UserEntity user = UserEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .restaurantId(request.getRestaurantId())
                .role(Role.RESTAURANT_ADMIN)
                .active(true)
                .build();

        userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }
    private UserResponse convertToUserResponse(UserEntity registerUser){
        return UserResponse.builder()
                .id(registerUser.getId())
                .name(registerUser.getName())
                .email(registerUser.getEmail())
                .build();
    }
}
