package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.TableBookingRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableBookingResponse;

import java.util.List;

public interface TableBookingService {

    TableBookingResponse bookTable(TableBookingRequest request);

    List<TableBookingResponse> getUserBookings(String userId);

    void cancelBooking(String id);
    List<TableBookingResponse> getAllBookings();

    List<TableBookingResponse> getBookingsByDate(String date);

    List<TableBookingResponse> getBookingsByStatus(String status);

}
