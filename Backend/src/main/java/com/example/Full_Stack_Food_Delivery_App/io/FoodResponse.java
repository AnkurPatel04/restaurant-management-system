package com.example.Full_Stack_Food_Delivery_App.io;

//Request DTO = what client sends
//Response DTO = what server returns
//FoodResponse DTO
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodResponse {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private double price;
    private String category;
    private boolean active;

}
