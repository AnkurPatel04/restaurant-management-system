package com.example.Full_Stack_Food_Delivery_App.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TableResponse {
    private String id;
    private int tableNumber;
    private int seats;
    private String status;
}