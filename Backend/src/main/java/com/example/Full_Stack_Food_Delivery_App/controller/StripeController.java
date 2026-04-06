package com.example.Full_Stack_Food_Delivery_App.controller;


import com.example.Full_Stack_Food_Delivery_App.io.PaymentDTO;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class StripeController {

    @Value("${stripe.secret.key}")
    private String stripeKey;

    @PostMapping("/create-session")
    public Map<String, String> createSession(@RequestBody PaymentDTO dto) throws Exception {

        Stripe.apiKey = stripeKey;

        // optional safety check
        if (dto.getAmount() < 50) {
            throw new RuntimeException("Minimum online payment is ₹50");
        }

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)

                        // Stripe decides payment methods automatically
                        .setAutomaticTax(
                                SessionCreateParams.AutomaticTax.builder()
                                        .setEnabled(false)
                                        .build()
                        )

                        .setSuccessUrl("https://restaurant-ordering-system-phi.vercel.app/payment-success")
                        .setCancelUrl("https://restaurant-ordering-system-phi.vercel.app/payment-failed")

                        // metadata useful later (webhook / order update)
                        .putMetadata("restaurantId", dto.getRestaurantId())
                        .putMetadata("tableNumber", String.valueOf(dto.getTableNumber()))

                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("inr")
                                                        .setUnitAmount((long) (dto.getAmount() * 100))
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Restaurant Bill Payment")
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        Session session = Session.create(params);

        return Map.of("url", session.getUrl());
    }
}