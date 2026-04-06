package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.TableBookingEntity;
import com.example.Full_Stack_Food_Delivery_App.entity.TableEntity;
import com.example.Full_Stack_Food_Delivery_App.io.TableBookingRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableBookingResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.TableBookingRepository;
import com.example.Full_Stack_Food_Delivery_App.repository.TableRepository;
import com.example.Full_Stack_Food_Delivery_App.service.TableBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableBookingServiceImpl implements TableBookingService {

    private final TableBookingRepository repository;
    private final TableRepository tableRepository;

    private String generateBookingNumber() {

        String today = LocalDate.now()
                .format(DateTimeFormatter.BASIC_ISO_DATE);

        TableBookingEntity lastBooking =
                repository.findTopByOrderByCreatedAtDesc();

        int next = 1;

        if (lastBooking != null &&
                lastBooking.getBookingNumber() != null) {

            String lastNo = lastBooking.getBookingNumber();
            // BOOK-20260216-005

            String[] parts = lastNo.split("-");

            if (parts.length == 3 &&
                    parts[1].equals(today)) {

                next = Integer.parseInt(parts[2]) + 1;
            }
        }

        return "BOOK-" + today + "-" +
                String.format("%03d", next);
    }


    @Override
    public TableBookingResponse bookTable(TableBookingRequest request) {
        List<TableBookingEntity> existing =
                repository.findByRestaurantIdAndDateAndTimeAndStatus(
                        request.getRestaurantId(),
                        request.getDate(),
                        request.getTime(),
                        "BOOKED"
                );
        boolean alreadyBooked = existing.stream()
                .anyMatch(b -> b.getTableId().equals(request.getTableId()));

        if (alreadyBooked) {
            throw new RuntimeException("Table already booked for this slot");
        }


        TableBookingEntity entity = TableBookingEntity.builder()
                .restaurantId(request.getRestaurantId())
                .userId(request.getUserId())
                .bookingNumber(generateBookingNumber())
                .createdAt(LocalDateTime.now())
                .tableId(request.getTableId())
                .date(request.getDate())
                .time(request.getTime())
                .guests(request.getGuests())
                .name(request.getName())
                .phone(request.getPhone())
                .status("BOOKED")
                .build();

        repository.save(entity);

        return mapToResponse(entity);
    }

    @Override
    public List<TableBookingResponse> getUserBookings(String userId) {

        return repository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelBooking(String id) {

        TableBookingEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        entity.setStatus("CANCELLED");
        repository.save(entity);
    }

    @Override
    public List<TableBookingResponse> getAllBookings() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<TableBookingResponse> getBookingsByDate(String date) {

        return repository.findByDate(date)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<TableBookingResponse> getBookingsByStatus(String status) {

        return repository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private TableBookingResponse mapToResponse(TableBookingEntity entity) {

        TableEntity table = tableRepository
                .findById(entity.getTableId())
                .orElse(null);

        return TableBookingResponse.builder()
                .id(entity.getId())
                .bookingNumber(entity.getBookingNumber())
                .tableId(entity.getTableId())
                .tableNumber(table.getTableNumber())
                .date(entity.getDate())
                .time(entity.getTime())
                .guests(entity.getGuests())
                .name(entity.getName())
                .phone(entity.getPhone())
                .status(entity.getStatus())
                .build();
    }
}
