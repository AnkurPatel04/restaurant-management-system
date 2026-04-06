package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.CouponRequest;
import com.example.Full_Stack_Food_Delivery_App.io.CouponResponse;

import java.util.List;
import java.util.Map;

public interface CouponService {

    CouponResponse createCoupon(CouponRequest request);

    List<CouponResponse> getCouponsByRestaurant(String restaurantId);

    Map<String,Object> applyCoupon(Map<String,Object> req);

    CouponResponse updateStatus(String id, boolean active);

    void deleteCoupon(String id);

}