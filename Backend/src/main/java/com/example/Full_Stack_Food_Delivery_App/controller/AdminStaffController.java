package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.entity.Role;
import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import com.example.Full_Stack_Food_Delivery_App.io.StaffRequest;
import com.example.Full_Stack_Food_Delivery_App.io.StaffResponse;
import com.example.Full_Stack_Food_Delivery_App.io.UserResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.UserRepository;
import com.example.Full_Stack_Food_Delivery_App.service.StaffService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class AdminStaffController {

    private final StaffService staffService;

    @PostMapping
    public StaffResponse addStaff(@RequestBody StaffRequest request) {
        return staffService.addStaff(request);
    }

    @GetMapping("/{restaurantId}")
    public List<StaffResponse> getAllStaff(
            @PathVariable String restaurantId,
            @RequestParam(required = false) String search) {

        return staffService.getAllStaff(restaurantId, search);
    }
    @PatchMapping("/{id}/status")
    public StaffResponse updateStatus(
            @PathVariable String id,
            @RequestParam boolean active) {
        return staffService.updateStatus(id, active);
    }

    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable String id) {
        staffService.deleteStaff(id);
    }

    @PutMapping("/{id}")
    public StaffResponse updateStaff(
            @PathVariable String id,
            @RequestBody StaffRequest request) {
        return staffService.updateStaff(id, request);
    }
}
