package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.TableBookingEntity;
import com.example.Full_Stack_Food_Delivery_App.entity.TableEntity;
import com.example.Full_Stack_Food_Delivery_App.io.TableRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.TableBookingRepository;
import com.example.Full_Stack_Food_Delivery_App.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableServiceImpl implements TableService{
    private final TableRepository tableRepository;
    private final TableBookingRepository tableBookingRepository;
    @Override
    public TableResponse addTable(TableRequest request) {
        TableEntity table = TableEntity.builder()
                .tableNumber(request.getTableNumber())
                .restaurantId(request.getRestaurantId())
                .seats(request.getSeats())
                .status(request.getStatus())
                .build();
        TableEntity saved = tableRepository.save(table);

        return convertToResponse(saved);
    }

    @Override
    public List<TableResponse> getAllTables(String restaurantId) {

        return tableRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<TableResponse> getAvailableTables(
            String restaurantId,
            String date,
            String time,
            int guests) {

        List<TableEntity> allTables =
                tableRepository.findByRestaurantId(restaurantId);

        List<TableBookingEntity> bookedTables =
                tableBookingRepository
                            .findByRestaurantIdAndDateAndTimeAndStatus(
                                    restaurantId,
                                date,
                                time,
                                "BOOKED"
                        );

        List<String> bookedTableIds = bookedTables.stream()
                .map(TableBookingEntity::getTableId)
                .toList();

        return allTables.stream()
                .filter(table ->
                        !bookedTableIds.contains(table.getId()) &&
                                table.getSeats() >= guests
                )
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public TableResponse updateTable(String id, TableRequest request) {
        TableEntity table = tableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Table not found"));

        table.setTableNumber(request.getTableNumber());
        table.setSeats(request.getSeats());
        table.setStatus(request.getStatus());

        TableEntity saved = tableRepository.save(table);
        return convertToResponse(saved);

    }

    @Override
    public void deleteTable(String id) {

        TableEntity table = tableRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Table not found"));

        tableRepository.deleteById(id);
    }

    @Override
    public TableResponse occupyTable(String restaurantId, int tableNumber) {

        TableEntity table = tableRepository
                .findByRestaurantIdAndTableNumber(restaurantId, tableNumber)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (!table.getStatus().equals("AVAILABLE")) {
            throw new RuntimeException("Table already occupied");
        }

        table.setStatus("OCCUPIED");

        TableEntity saved = tableRepository.save(table);

        return convertToResponse(saved);
    }



    private TableResponse convertToResponse(TableEntity table) {
        return TableResponse.builder()
                .id(table.getId())
                .tableNumber(table.getTableNumber())
                .seats(table.getSeats())
                .status(table.getStatus())
                .build();
    }
}
