package com.example.Full_Stack_Food_Delivery_App.io;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {


    private String id;//Cart id
    private String restaurantId;
    private String userId;
    private String tableNo;
    // foodId -> quantity
    private Map<String, Integer> items;
}