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
public class CartRequest {

    private String restaurantId;
    private String foodId;
    private String tableNo;

}