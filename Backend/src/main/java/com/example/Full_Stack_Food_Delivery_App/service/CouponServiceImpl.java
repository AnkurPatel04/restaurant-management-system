package com.example.Full_Stack_Food_Delivery_App.service;


import com.example.Full_Stack_Food_Delivery_App.entity.CouponEntity;
import com.example.Full_Stack_Food_Delivery_App.io.CouponRequest;
import com.example.Full_Stack_Food_Delivery_App.io.CouponResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    public CouponResponse createCoupon(CouponRequest request) {

        CouponEntity coupon = CouponEntity.builder()
                .code(request.getCode())
                .discount(request.getDiscount())
                .type(request.getType())
                .active(request.isActive())
                .expiryDate(request.getExpiryDate())
                .restaurantId(request.getRestaurantId())
                .build();

        CouponEntity saved = couponRepository.save(coupon);

        return convertToResponse(saved);
    }

    @Override
    public List<CouponResponse> getCouponsByRestaurant(String restaurantId) {

        return couponRepository
                .findByRestaurantId(restaurantId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public Map<String, Object> applyCoupon(Map<String, Object> req) {

        String code = req.get("code").toString();
        String restaurantId = req.get("restaurantId").toString();
        double amount = Double.parseDouble(req.get("amount").toString());

        CouponEntity coupon = couponRepository
                .findByCodeAndRestaurantId(code, restaurantId)
                .orElseThrow(() -> new RuntimeException("Invalid coupon"));

        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon inactive");
        }

        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Coupon expired");
        }

        double discount = 0;

        if (coupon.getType().equals("PERCENT")) {
            discount = amount * coupon.getDiscount() / 100;
        } else {
            discount = coupon.getDiscount();
        }

        double finalAmount = amount - discount;

        return Map.of(
                "discount", discount,
                "finalAmount", finalAmount
        );
    }

    @Override
    public CouponResponse updateStatus(String id, boolean active) {

        CouponEntity coupon = couponRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        coupon.setActive(active);

        CouponEntity saved = couponRepository.save(coupon);

        return convertToResponse(saved);
    }

    @Override
    public void deleteCoupon(String id) {

        CouponEntity coupon = couponRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        couponRepository.delete(coupon);
    }

    private CouponResponse convertToResponse(CouponEntity coupon){

        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .discount(coupon.getDiscount())
                .type(coupon.getType())
                .active(coupon.isActive())
                .expiryDate(coupon.getExpiryDate())
                .restaurantId(coupon.getRestaurantId())
                .build();
    }

}