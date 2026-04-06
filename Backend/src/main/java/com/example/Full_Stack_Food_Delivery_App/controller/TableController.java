package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.TableRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableResponse;
import com.example.Full_Stack_Food_Delivery_App.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @PostMapping
    public TableResponse add(@RequestBody TableRequest request) {
        return tableService.addTable(request);
    }

    @GetMapping("/{restaurantId}")
    public List<TableResponse> getAll(@PathVariable String restaurantId) {
        return tableService.getAllTables(restaurantId);
    }

    @PutMapping("/{id}")
    public TableResponse update(
            @PathVariable String id,
            @RequestBody TableRequest request) {
        return tableService.updateTable(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        tableService.deleteTable(id);
    }

    @GetMapping("/available/{restaurantId}")
    public List<TableResponse> getAvailableTables(
            @PathVariable String restaurantId,
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam int guests) {

        return tableService.getAvailableTables(restaurantId,date,time,guests);
    }

    @PutMapping("/{restaurantId}/occupy/{tableNumber}")
    public TableResponse occupyTable(
            @PathVariable String restaurantId,
            @PathVariable int tableNumber) {

        return tableService.occupyTable(restaurantId,tableNumber);
    }



}