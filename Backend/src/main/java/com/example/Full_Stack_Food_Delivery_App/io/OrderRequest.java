package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderRequest {

    private String userId;

    private double amount;

    private List<OrderItem> orderedItems;
    private String orderStatus;
    private int tableNumber;
    private String customerName;   // ✅ ADD
    private String restaurantId;

}
