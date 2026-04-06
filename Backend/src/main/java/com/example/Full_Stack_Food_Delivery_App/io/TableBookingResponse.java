package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TableBookingResponse {

    private String id;
    private String bookingNumber;
    private String tableId;
    private int tableNumber;
    private String date;
    private String time;
    private int guests;
    private String name;
    private String phone;
    private String status;
}
