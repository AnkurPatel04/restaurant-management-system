package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class PaymentDTO {

    private String restaurantId;
    private int tableNumber;
    private double amount;
    private String paymentMethod;

}