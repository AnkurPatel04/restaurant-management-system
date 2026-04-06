package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Data;

@Data
public class PaymentRequest {
    private String paymentMethod;// CASH, UPI, CARD
    private String couponCode;   // NEW

    private double discount;
}
