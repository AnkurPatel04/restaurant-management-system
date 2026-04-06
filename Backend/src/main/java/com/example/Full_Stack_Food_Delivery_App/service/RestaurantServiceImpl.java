package com.example.Full_Stack_Food_Delivery_App.service;


import com.example.Full_Stack_Food_Delivery_App.entity.RestaurantEntity;
import com.example.Full_Stack_Food_Delivery_App.io.RestaurantRequest;
import com.example.Full_Stack_Food_Delivery_App.io.RestaurantResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Override
    public RestaurantResponse createRestaurant(RestaurantRequest request) {

        RestaurantEntity restaurant = RestaurantEntity.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .build();

        restaurant = restaurantRepository.save(restaurant);

        RestaurantResponse response = new RestaurantResponse();

        response.setId(restaurant.getId());
        response.setName(restaurant.getName());
        response.setAddress(restaurant.getAddress());
        response.setPhone(restaurant.getPhone());
        response.setEmail(restaurant.getEmail());

        return response;
    }

    @Override
    public List<RestaurantResponse> getAllRestaurants() {

        return restaurantRepository.findAll()
                .stream()
                .map(r -> {
                    RestaurantResponse res = new RestaurantResponse();
                    res.setId(r.getId());
                    res.setName(r.getName());
                    res.setAddress(r.getAddress());
                    res.setPhone(r.getPhone());
                    res.setEmail(r.getEmail());
                    return res;
                }).collect(Collectors.toList());
    }
}
