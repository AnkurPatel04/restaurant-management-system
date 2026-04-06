package com.example.Full_Stack_Food_Delivery_App.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.Full_Stack_Food_Delivery_App.io.OrderItem;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Data;

@Document(collection = "orders")
@Data
@Builder
public class OrderEntity {

    @Id
    private String id;
    private String userId;
    private String orderNumber;   // ✅ ORD-20260121-001



    private int tableNumber;
    private String customerName;   // ✅ ADD THIS

    private List<OrderItem> orderedItems;
    private double amount;

    private String orderStatus;       // CREATED, COOKING, READY, SERVED
    private String paymentStatus; // UNPAID, PAID
    private String paymentMethod; // CASH, UPI, CARD


    private LocalDateTime createdAt;
    private String restaurantId;

    private String couponCode;

    private Double discount;

}
