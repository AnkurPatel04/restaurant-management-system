package com.example.Full_Stack_Food_Delivery_App.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "foods")
public class FoodEntity {

    @Id
    private String id;

    private String name;
    private String description;
    private double price;
    private String category;
    private boolean active;
    private String imageUrl;
    private String imagePublicId;
    private String restaurantId;
}
