package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {



    private String id;
    private String orderNumber;
    private String userId;


    private List<OrderItem> orderedItems;
    private double amount;
    private int tableNumber;
    private String customerName;   // ✅ ADD
    private LocalDateTime createdAt;




    private String orderStatus;         // CREATED, CONFIRMED, DELIVERED
}
