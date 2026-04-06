package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.CartRequest;
import com.example.Full_Stack_Food_Delivery_App.io.CartResponse;

public interface CartService {
     CartResponse addTocart(CartRequest request);
     CartResponse getCart(String restaurantId);
     void clearCart(String restaurantId);
     CartResponse removeFromCart(CartRequest request);
    CartResponse removeAllFromCart(CartRequest request);
    void clearTableNo(String restaurantId);
}
