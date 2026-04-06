package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.TableBookingRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableBookingResponse;
import com.example.Full_Stack_Food_Delivery_App.service.TableBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class TableBookingController {

    private final TableBookingService service;

    @PostMapping
    public TableBookingResponse book(@RequestBody TableBookingRequest request) {
        return service.bookTable(request);
    }

    @GetMapping("/user/{userId}")
    public List<TableBookingResponse> getUserBookings(
            @PathVariable String userId) {
        return service.getUserBookings(userId);
    }

    @PutMapping("/cancel/{id}")
    public void cancel(@PathVariable String id) {
        service.cancelBooking(id);
    }

    @GetMapping("/all")
    public List<TableBookingResponse> getAllBookings() {
        return service.getAllBookings();
    }

    @GetMapping("/date/{date}")
    public List<TableBookingResponse> getBookingsByDate(@PathVariable String date) {
        return service.getBookingsByDate(date);
    }

}
