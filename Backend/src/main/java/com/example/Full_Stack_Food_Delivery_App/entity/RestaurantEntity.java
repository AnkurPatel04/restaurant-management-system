package com.example.Full_Stack_Food_Delivery_App.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "restaurants")
public class RestaurantEntity {

    @Id
    private String id;

    private String name;

    private String address;

    private String phone;

    private String email;

    private String logoUrl;

    private String createdBy; // main admin id
}