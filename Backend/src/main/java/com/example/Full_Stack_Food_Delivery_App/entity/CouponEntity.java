package com.example.Full_Stack_Food_Delivery_App.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "coupons")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CouponEntity {

    @Id
    private String id;

    private String code;        // SAVE5
    private double discount;    // 5
    private String type;        // PERCENT or FLAT

    private boolean active;

    private LocalDate expiryDate;

    private String restaurantId;
}