package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.entity.OrderEntity;
import com.example.Full_Stack_Food_Delivery_App.io.OrderRequest;
import com.example.Full_Stack_Food_Delivery_App.io.OrderResponse;
import com.example.Full_Stack_Food_Delivery_App.io.PaymentRequest;
import com.example.Full_Stack_Food_Delivery_App.repository.OrderRepository;
import com.example.Full_Stack_Food_Delivery_App.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
//@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    // Admin: get all orders
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(orderService.getAllOrders(restaurantId));
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {
        OrderResponse response = orderService.updateOrderStatus(id,status);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/kitchen/{restaurantId}")
    public ResponseEntity<List<OrderResponse>> getKitchenOrders(
            @PathVariable String restaurantId) {

        return ResponseEntity.ok(
                orderService.getKitchenOrders(restaurantId)
        );
    }
    @GetMapping("/last/{userId}")
    public ResponseEntity<OrderResponse> getLastOrder(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getLastOrder(userId));

    }
    @GetMapping("/{restaurantId}/table/{tableNumber}")
    public ResponseEntity<List<OrderResponse>> getOrdersByTable(
            @PathVariable String restaurantId,
            @PathVariable int tableNumber) {

        return ResponseEntity.ok(
                orderService.getOrdersByTable(restaurantId, tableNumber)
        );
    }
    @PutMapping("/{restaurantId}/pay/{tableNumber}")
    public ResponseEntity<List<String>> payTable(
            @PathVariable String restaurantId,
            @PathVariable int tableNumber,
            @RequestBody PaymentRequest request) {

        List<OrderEntity> paidOrders =
                orderService.payAllOrders(restaurantId, tableNumber, request.getPaymentMethod(),request.getCouponCode(),
                        request.getDiscount());

        List<String> orderIds = paidOrders.stream()
                .map(OrderEntity::getId)
                .toList();

        return ResponseEntity.ok(orderIds);
    }


    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }


    @PostMapping("/invoice")
    public ResponseEntity<byte[]> downloadInvoice(
            @RequestBody List<String> orderIds) {

        byte[] pdf = orderService.generateInvoiceFromOrders(orderIds);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

}
