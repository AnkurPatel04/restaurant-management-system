package com.example.Full_Stack_Food_Delivery_App.io;


//FoodRequest DTO
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodRequest {

    private String name;
    private String description;
    private double price;
    private String category;
    private Boolean active;
    private String restaurantId;

}
