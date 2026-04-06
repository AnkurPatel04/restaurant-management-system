package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.FoodEntity;
import com.example.Full_Stack_Food_Delivery_App.io.FoodRequest;
import com.example.Full_Stack_Food_Delivery_App.io.FoodResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;
    private final ImageService imageService;

    @Override
    public Map uploadFile(MultipartFile file) {
        try {
            return imageService.uploadImage(file);
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {

        Map result = imageService.uploadImage(file);

        String imageUrl = result.get("secure_url").toString();
        String publicId = result.get("public_id").toString();

        FoodEntity food = convertToEntity(request, imageUrl,publicId);

        FoodEntity saved = foodRepository.save(food);

        return convertToResponse(saved);
    }



    @Override
    public List<FoodResponse> readFood(String restaurantId) {
        List<FoodEntity> databaseentry = foodRepository.findAll();
        return foodRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::convertToResponse)
                .toList();

    }

    @Override
    public FoodResponse readFoodone(String id) {
        FoodEntity food = foodRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Food not found with id: " + id
        ));
        return convertToResponse(food);
    }

    @Override
    public void deleteFood(String id) {
        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Food not found with id: " + id
                ));
//        if(food.getImageUrl() != null){
//            imageService.deleteImage(food.getImageUrl());
//        }
        foodRepository.deleteById(id);
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request, MultipartFile file) {

        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Food not found"));

        if (file != null && !file.isEmpty()) {

            // delete old image
            if (food.getImagePublicId() != null) {
                imageService.deleteImage(food.getImagePublicId());
            }

            Map result = imageService.uploadImage(file);

            food.setImageUrl(result.get("secure_url").toString());
            food.setImagePublicId(result.get("public_id").toString());
        }

        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setCategory(request.getCategory());

        FoodEntity saved = foodRepository.save(food);

        return convertToResponse(saved);
    }

    @Override
    public FoodResponse updateFoodStatus(String id, boolean active) {

        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Food not found"));

        food.setActive(active);
        FoodEntity saved = foodRepository.save(food);
        return convertToResponse(saved);
    }


    private FoodEntity convertToEntity(FoodRequest request, String imageUrl,String publicId) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .restaurantId(request.getRestaurantId())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(imageUrl)
                .imagePublicId(publicId)
                .active(true)
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .imageUrl(food.getImageUrl())
                .price(food.getPrice())
                .category(food.getCategory())
                .active(food.isActive())
                .build();
    }

}
