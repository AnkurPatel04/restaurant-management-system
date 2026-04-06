package com.example.Full_Stack_Food_Delivery_App.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableEntity {

    @Id
    private String id;

    private int tableNumber;
    private int seats;
    private String status; // AVAILABLE, OCCUPIED, RESERVED
    private String restaurantId;
}