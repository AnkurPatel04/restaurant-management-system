package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.CouponRequest;
import com.example.Full_Stack_Food_Delivery_App.io.CouponResponse;
import com.example.Full_Stack_Food_Delivery_App.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/create")
    public CouponResponse createCoupon(@RequestBody CouponRequest request){
        return couponService.createCoupon(request);
    }

    @GetMapping("/{restaurantId}")
    public List<CouponResponse> getCoupons(@PathVariable String restaurantId){
        return couponService.getCouponsByRestaurant(restaurantId);
    }

    @PostMapping("/apply")
    public Map<String,Object> applyCoupon(@RequestBody Map<String,Object> req){
        return couponService.applyCoupon(req);
    }

    @PatchMapping("/{id}/status")
    public CouponResponse updateStatus(
            @PathVariable String id,
            @RequestParam boolean active){
        return couponService.updateStatus(id,active);
    }

    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable String id){
        couponService.deleteCoupon(id);
    }

}