package com.example.Full_Stack_Food_Delivery_App.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "table_bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableBookingEntity {

    @Id
    private String id;

    private String restaurantId;

    private String bookingNumber;

    private String userId;     // from localStorage
    private String tableId;    // reference to Table

    private String date;
    private String time;
    private int guests;
    private String name;
    private String phone;
    private String status;     // BOOKED / CANCELLED

    private LocalDateTime createdAt;

}
