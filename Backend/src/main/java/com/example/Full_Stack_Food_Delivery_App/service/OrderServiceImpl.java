package com.example.Full_Stack_Food_Delivery_App.service;


import com.example.Full_Stack_Food_Delivery_App.entity.OrderEntity;
import com.example.Full_Stack_Food_Delivery_App.entity.RestaurantEntity;
import com.example.Full_Stack_Food_Delivery_App.entity.TableEntity;
import com.example.Full_Stack_Food_Delivery_App.io.OrderItem;
import com.example.Full_Stack_Food_Delivery_App.io.OrderRequest;
import com.example.Full_Stack_Food_Delivery_App.io.OrderResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.OrderRepository;
import com.example.Full_Stack_Food_Delivery_App.repository.RestaurantRepository;
import com.example.Full_Stack_Food_Delivery_App.repository.TableRepository;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import com.lowagie.text.pdf.draw.LineSeparator;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;


@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final TableRepository tableRepository;

    private RestaurantRepository restaurantRepository;



    private String generateOrderNumber() {

        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);

        OrderEntity lastOrder = orderRepository.findTopByOrderByCreatedAtDesc();


        int next = 1;

        if (lastOrder != null && lastOrder.getOrderNumber() != null) {
            String lastNo = lastOrder.getOrderNumber();// ORD-20260121-005
            String[] parts = lastNo.split("-"); // [ORD, 20260121, 005]

            if (parts[1].equals(today)) {
                next = Integer.parseInt(parts[2]) + 1;
            }
        }
        return "ORD-" + today + "-" + String.format("%03d", next);
    }

    @Override
    public List<OrderResponse> getKitchenOrders(String restaurantId) {
        return orderRepository
                .findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public OrderResponse getLastOrder(String userId) {
        OrderEntity lastOrder = orderRepository.findTopByUserIdOrderByCreatedAtDesc(userId).orElseThrow(() -> new RuntimeException("Order not found"));

        return convertToResponse(lastOrder);
    }

    // ================= CREATE =================
    @Override
    public OrderResponse createOrder(OrderRequest request) {

        OrderEntity order = convertToEntity(request);
        OrderEntity saved = orderRepository.save(order);

// 🔥 Broadcast to kitchen
        messagingTemplate.convertAndSend("/topic/orders", convertToResponse(saved));
        return convertToResponse(saved);
    }

    // ================= READ ALL =================
    @Override
    public List<OrderResponse> getAllOrders(String restaurantId) {

        return orderRepository
                .findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(String orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return convertToResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUser(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ================= DELETE =================
    @Override
    public void deleteOrder(String id) {

        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderRepository.delete(order);
    }

    @Override
    public OrderResponse updateOrderStatus(String id, String status) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        OrderEntity saved = orderRepository.save(order);
        // 🔥 Broadcast status update
        messagingTemplate.convertAndSend("/topic/orders", convertToResponse(saved));

        return convertToResponse(saved);
    }
    @Override
    public List<OrderResponse> getOrdersByTable(String restaurantId, int tableNo) {

        return orderRepository
                .findByRestaurantIdAndTableNumberAndPaymentStatusOrderByCreatedAtDesc(
                        restaurantId,
                        tableNo,
                        "UNPAID"
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<OrderEntity> payAllOrders(String restaurantId,int tableNumber, String paymentMethod,String couponCode,
                                          double discount) {


        if (!List.of("CASH", "UPI", "CARD").contains(paymentMethod.toUpperCase())) {
            throw new RuntimeException("Invalid Payment Method");
        }
//        System.out.println("Restaurant: " + restaurantId);
//        System.out.println("Table: " + tableNumber);

        List<OrderEntity> unpaidOrders =
                orderRepository
                        .findByRestaurantIdAndTableNumberAndPaymentStatusOrderByCreatedAtDesc(
                                restaurantId,
                                tableNumber,
                                "UNPAID"
                        );

        if (unpaidOrders.isEmpty()) {
            throw new RuntimeException("No unpaid orders found");
        }

        unpaidOrders.forEach(order -> {
            order.setPaymentStatus("PAID");
            order.setPaymentMethod(paymentMethod.toUpperCase());
            order.setCouponCode(couponCode);
            order.setDiscount(discount);
        });
        orderRepository.saveAll(unpaidOrders);

        TableEntity table = tableRepository
                .findByRestaurantIdAndTableNumber(restaurantId, tableNumber)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus("AVAILABLE");
        tableRepository.save(table);
        return unpaidOrders;
    }




    @Override
    public byte[] generateInvoiceFromOrders(List<String> orderIds){

//        List<OrderEntity> orders =
//                orderRepository
//                        .findByTableNumberAndPaymentStatusOrderByCreatedAtDesc(
//                                tableNumber,
//                                "PAID"
//                        );


        System.out.println(orderIds);
        List<OrderEntity> orders =
                orderRepository.findAllById(orderIds);

        if (orders.isEmpty()) {
            throw new RuntimeException("No paid orders found");
        }

        String restaurantId = orders.get(0).getRestaurantId();
        RestaurantEntity restaurant = restaurantRepository
                .findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            // ===== ROYAL BLUE CORPORATE THEME =====
            Color headerBg = new Color(239, 246, 255);   // #eff6ff (table header bg)
            Color lightGray = new Color(226, 232, 240);  // #e2e8f0 (row alternate)
            Color darkBlue = new Color(30, 58, 138);     // #1e3a8a (title color)
            Color totalBg = new Color(219, 234, 254);    // #dbeafe (light blue highlight)
            Color accentBlue = new Color(37, 99, 235);   // #2563eb (NET highlight)
            Color paymentBg = new Color(219, 234, 254);  // #dbeafe
            Color paymentText = new Color(30, 64, 175);  // #1e40af



            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD, darkBlue);

            Font normalFont = new Font(Font.HELVETICA, 12);
            Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font bigBold = new Font(Font.HELVETICA, 16, Font.BOLD);
            // ===== COLORS =====



            // ================= HEADER =================
            Paragraph title = new Paragraph(restaurant.getName().toUpperCase(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph address = new Paragraph(restaurant.getAddress(), normalFont);
            address.setAlignment(Element.ALIGN_CENTER);
            document.add(address);

            Paragraph phone = new Paragraph("Phone: " + restaurant.getPhone(), normalFont);
            phone.setAlignment(Element.ALIGN_CENTER);
            document.add(phone);

            Paragraph email = new Paragraph("Email: " + restaurant.getEmail(), normalFont);
            email.setAlignment(Element.ALIGN_CENTER);
            document.add(email);

            document.add(new Paragraph(" "));
            document.add(new LineSeparator());
            document.add(new Paragraph(" "));

            // ================= BILL INFO =================
            int tableNumber = orders.get(0).getTableNumber();
            String invoiceNumber = "INV-" + System.currentTimeMillis();
            document.add(new Paragraph("Bill No: " + invoiceNumber, boldFont));
            document.add(new Paragraph("Table No: " + tableNumber, normalFont));
            document.add(new Paragraph("Date: " +
                    LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), normalFont));

            document.add(new Paragraph(" "));
            document.add(new LineSeparator());
            document.add(new Paragraph(" "));

            // ================= ITEMS TABLE =================
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4, 1, 2, 2});

            PdfPCell h1 = new PdfPCell(new Phrase("Item", boldFont));
            PdfPCell h2 = new PdfPCell(new Phrase("Qty", boldFont));
            PdfPCell h3 = new PdfPCell(new Phrase("Rate", boldFont));
            PdfPCell h4 = new PdfPCell(new Phrase("Amt", boldFont));

            h1.setBackgroundColor(headerBg);
            h2.setBackgroundColor(headerBg);
            h3.setBackgroundColor(headerBg);
            h4.setBackgroundColor(headerBg);

            h1.setHorizontalAlignment(Element.ALIGN_CENTER);
            h2.setHorizontalAlignment(Element.ALIGN_CENTER);
            h3.setHorizontalAlignment(Element.ALIGN_CENTER);
            h4.setHorizontalAlignment(Element.ALIGN_CENTER);

            table.addCell(h1);
            table.addCell(h2);
            table.addCell(h3);
            table.addCell(h4);


            double subtotal = 0;
            int rowIndex = 0;


            for (OrderEntity order : orders) {
                for (OrderItem item : order.getOrderedItems()) {

                    double total = item.getPrice() * item.getQuantity();
                    subtotal += total;

                    PdfPCell c1 = new PdfPCell(new Phrase(item.getName(), normalFont));
                    PdfPCell c2 = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                    PdfPCell c3 = new PdfPCell(new Phrase(String.format("%.2f", item.getPrice()), normalFont));
                    PdfPCell c4 = new PdfPCell(new Phrase(String.format("%.2f", total), normalFont));

                   if (rowIndex % 2 == 0) {
                        c1.setBackgroundColor(lightGray);
                        c2.setBackgroundColor(lightGray);
                        c3.setBackgroundColor(lightGray);
                        c4.setBackgroundColor(lightGray);
                    }

                    table.addCell(c1);
                    table.addCell(c2);
                    table.addCell(c3);
                    table.addCell(c4);
                    rowIndex++;
                }
            }

            document.add(table);

            document.add(new Paragraph(" "));
            document.add(new LineSeparator());
            document.add(new Paragraph(" "));

            // ================= TAX CALCULATION =================


            double discount = orders.stream()
                    .mapToDouble(OrderEntity::getDiscount)
                    .sum();

            double sgst = subtotal * 0.025;
            double cgst = subtotal * 0.025;
//            double grandTotal = subtotal + sgst + cgst;
            double grandTotal = subtotal + sgst + cgst - discount;

            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(50);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            PdfPCell netLabel = new PdfPCell(new Phrase("Total RS:", bigBold));
            PdfPCell netValue = new PdfPCell(new Phrase(String.format("%.2f", subtotal), bigBold));

            netLabel.setBackgroundColor(totalBg);
            netValue.setBackgroundColor(totalBg);

//            netLabel.setBorder(Rectangle.NO_BORDER);
//            netValue.setBorder(Rectangle.NO_BORDER);


            totalTable.addCell(netLabel);
            totalTable.addCell(netValue);

            if(discount > 0){

                totalTable.addCell(new PdfPCell(new Phrase("Coupon Discount:", boldFont)));

                totalTable.addCell(new PdfPCell(new Phrase(
                        String.format("Rs. -%.2f", discount), boldFont)));
            }

            totalTable.addCell(new PdfPCell(new Phrase("SGST 2.5%:", boldFont)));
            totalTable.addCell(new PdfPCell(new Phrase(
                    String.format("Rs. %.2f", sgst), boldFont)));

            totalTable.addCell(new PdfPCell(new Phrase("CGST 2.5%:", boldFont)));
            totalTable.addCell(new PdfPCell(new Phrase(
                    String.format("Rs. %.2f", cgst), boldFont)));

            Font netFont = new Font(Font.HELVETICA, 16, Font.BOLD, accentBlue);

            PdfPCell netTextCell = new PdfPCell(new Phrase("NET RS:", netFont));
            PdfPCell netValueCell = new PdfPCell(new Phrase(
                    String.format("%.2f", grandTotal), netFont));

//            netTextCell.setBorder(Rectangle.NO_BORDER);
//            netValueCell.setBorder(Rectangle.NO_BORDER);

            totalTable.addCell(netTextCell);
            totalTable.addCell(netValueCell);


            document.add(totalTable);

            document.add(new Paragraph(" "));
            document.add(new LineSeparator());
            document.add(new Paragraph(" "));

            // ================= PAYMENT STATUS =================
            String paymentMethod = orders.stream()
                    .map(OrderEntity::getPaymentMethod)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse("N/A");

            String paymentStatus = "PAID";


            PdfPCell paymentCell = new PdfPCell(
                    new Phrase(
                            "Payment Status: " + paymentStatus +
                                    "  |  Method: " + paymentMethod,
                            new Font(Font.HELVETICA, 12, Font.BOLD, paymentText)
                    )
            );

            paymentCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            paymentCell.setBorder(Rectangle.NO_BORDER);
            paymentCell.setBackgroundColor(paymentBg);


            PdfPTable paymentTable = new PdfPTable(1);
            paymentTable.setWidthPercentage(100);
            paymentTable.addCell(paymentCell);

            document.add(paymentTable);


            document.add(new Paragraph(" "));
            Paragraph thank = new Paragraph("Thank you for dining with us!", normalFont);
            thank.setAlignment(Element.ALIGN_CENTER);
            document.add(thank);

            Paragraph visit = new Paragraph("<< VISIT AGAIN >>", boldFont);
            visit.setAlignment(Element.ALIGN_CENTER);
            document.add(visit);

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }








    // ================= CONVERTERS =================

    private OrderEntity convertToEntity(OrderRequest request) {
        String orderNo = generateOrderNumber(); // ✅ GET ORDER NUMBER
        return OrderEntity.builder()
                .userId(request.getUserId())
                .orderNumber(orderNo)
                .customerName(request.getCustomerName())
                .restaurantId(request.getRestaurantId())
                .orderedItems(request.getOrderedItems())
                .tableNumber(request.getTableNumber())
                .amount(request.getAmount())
                .orderStatus("CREATED")
                .paymentStatus("UNPAID")
                .createdAt(LocalDateTime.now())
                .build();
    }

    private OrderResponse convertToResponse(OrderEntity o) {
        return OrderResponse.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .userId(o.getUserId())
                .customerName(o.getCustomerName())
                .orderedItems(o.getOrderedItems())
                .amount(o.getAmount())
                .orderStatus(o.getOrderStatus())
                .tableNumber(o.getTableNumber())
                .createdAt(o.getCreatedAt())
                .build();
    }
}
