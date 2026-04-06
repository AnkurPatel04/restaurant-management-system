package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.StaffRequest;
import com.example.Full_Stack_Food_Delivery_App.io.StaffResponse;

import java.util.List;

public interface StaffService {

    StaffResponse addStaff(StaffRequest request);

    List<StaffResponse> getAllStaff(String restaurantId,String search);

    StaffResponse updateStatus(String id, boolean active);

    void deleteStaff(String id);
    StaffResponse updateStaff(String id, StaffRequest request);
}
